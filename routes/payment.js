const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const Order = require("../models/order.js");
const Payment = require("../models/payment.js");
const User = require("../models/user.js");
const wrapAsync = require("../util/wrapAsync.js");
const ExpressError = require("../util/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Show checkout form
router.get("/:listingId/checkout", isLoggedIn, wrapAsync(async (req, res) => {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId);
    
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // Get the stored dates and nights from query params or session
    const checkInDate = req.query.checkInDate || req.session.checkInDate;
    const checkOutDate = req.query.checkOutDate || req.session.checkOutDate;
    const numberOfNights = req.query.numberOfNights || req.session.numberOfNights;

    if (!checkInDate || !checkOutDate || !numberOfNights) {
        req.flash("error", "Please select check-in and check-out dates!");
        return res.redirect(`/listings/${listingId}`);
    }

    const totalPrice = listing.price * numberOfNights;

    res.render("payment/checkout.ejs", {
        listing,
        checkInDate,
        checkOutDate,
        numberOfNights,
        totalPrice
    });
}));

// Process checkout (create order and payment intent)
router.post("/:listingId/checkout", isLoggedIn, wrapAsync(async (req, res) => {
    const { listingId } = req.params;
    const { checkInDate, checkOutDate, numberOfNights, guestName, guestEmail, guestPhone, guestAddress, guestCity, guestState, guestZipCode, guestCountry } = req.body;

    const listing = await Listing.findById(listingId);
    
    if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
    }

    const totalPrice = listing.price * numberOfNights;

    // Create Order
    const order = new Order({
        listing: listingId,
        buyer: req.user._id,
        checkInDate,
        checkOutDate,
        numberOfNights,
        pricePerNight: listing.price,
        totalPrice,
        guestName,
        guestEmail,
        guestPhone,
        guestAddress,
        guestCity,
        guestState,
        guestZipCode,
        guestCountry,
        status: "pending"
    });

    await order.save();

    // Create Payment Intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalPrice * 100), // Stripe uses cents
        currency: "usd",
        metadata: {
            orderId: order._id.toString(),
            listingId,
            userId: req.user._id.toString()
        },
        description: `Booking for ${listing.title}`
    });

    // Create Payment record
    const payment = new Payment({
        order: order._id,
        user: req.user._id,
        amount: totalPrice,
        stripePaymentIntentId: paymentIntent.id,
        status: "pending"
    });

    await payment.save();

    res.json({
        orderId: order._id,
        paymentId: payment._id,
        clientSecret: paymentIntent.client_secret,
        amount: totalPrice
    });
}));

// Payment confirmation page
router.get("/confirm/:orderId", isLoggedIn, wrapAsync(async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
        .populate("listing")
        .populate("buyer");

    if (!order) {
        req.flash("error", "Order not found!");
        return res.redirect("/listings");
    }

    if (order.buyer._id.toString() !== req.user._id.toString()) {
        req.flash("error", "You are not authorized to view this order!");
        return res.redirect("/listings");
    }

    const payment = await Payment.findOne({ order: orderId });

    res.render("payment/confirmation.ejs", { order, payment });
}));

// Webhook for Stripe events
router.post("/webhook", express.raw({ type: "application/json" }), wrapAsync(async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
    }

    // Handle the event
    switch (event.type) {
        case "payment_intent.succeeded":
            await handlePaymentSucceeded(event.data.object);
            break;
        case "payment_intent.payment_failed":
            await handlePaymentFailed(event.data.object);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
}));

// Handle successful payment
async function handlePaymentSucceeded(paymentIntent) {
    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntent.id });

    if (payment) {
        payment.status = "succeeded";
        payment.transactionId = paymentIntent.id;
        payment.paymentDate = new Date();
        await payment.save();

        const order = await Order.findById(payment.order);
        if (order) {
            order.status = "confirmed";
            await order.save();
        }

        console.log("Payment succeeded:", paymentIntent.id);
    }
}

// Handle failed payment
async function handlePaymentFailed(paymentIntent) {
    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntent.id });

    if (payment) {
        payment.status = "failed";
        payment.failureReason = paymentIntent.last_payment_error?.message || "Payment failed";
        await payment.save();

        const order = await Order.findById(payment.order);
        if (order) {
            order.status = "cancelled";
            await order.save();
        }

        console.log("Payment failed:", paymentIntent.id);
    }
}

// Get payment status
router.get("/status/:paymentIntentId", isLoggedIn, wrapAsync(async (req, res) => {
    const { paymentIntentId } = req.params;

    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });

    if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
    }

    const order = await Order.findById(payment.order);

    if (order.buyer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    res.json({
        status: payment.status,
        orderId: payment.order,
        amount: payment.amount
    });
}));

// Cancel order and refund
router.post("/:orderId/cancel", isLoggedIn, wrapAsync(async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
        req.flash("error", "Order not found!");
        return res.redirect("/listings");
    }

    if (order.buyer.toString() !== req.user._id.toString()) {
        req.flash("error", "You are not authorized to cancel this order!");
        return res.redirect("/listings");
    }

    if (order.status !== "confirmed" && order.status !== "pending") {
        req.flash("error", "This order cannot be cancelled!");
        return res.redirect(`/payment/confirm/${orderId}`);
    }

    const payment = await Payment.findOne({ order: orderId });

    // Refund using Stripe
    if (payment && payment.stripePaymentIntentId && payment.status === "succeeded") {
        const refund = await stripe.refunds.create({
            payment_intent: payment.stripePaymentIntentId
        });

        payment.isRefunded = true;
        payment.refundedAmount = payment.amount;
        payment.refundDate = new Date();
        payment.status = "cancelled";
        await payment.save();
    }

    order.status = "cancelled";
    await order.save();

    req.flash("success", "Order cancelled successfully!");
    res.redirect("/listings");
}));

// Get user's orders
router.get("/my-orders", isLoggedIn, wrapAsync(async (req, res) => {
    const orders = await Order.find({ buyer: req.user._id })
        .populate("listing")
        .sort({ createdAt: -1 });

    const payments = await Payment.find({ user: req.user._id })
        .populate("order")
        .sort({ createdAt: -1 });

    res.render("payment/my-orders.ejs", { orders, payments });
}));

// Booking Dashboard (for owners to see all bookings of their listings)
router.get("/dashboard", isLoggedIn, wrapAsync(async (req, res) => {
    // Get all listings owned by this user
    const userListings = await Listing.find({ owner: req.user._id });
    const listingIds = userListings.map(listing => listing._id);

    // Get all bookings for these listings
    let bookings = await Order.find({ listing: { $in: listingIds } })
        .populate("listing")
        .populate("buyer");

    // Apply filters
    const { status, sortBy } = req.query;

    if (status) {
        bookings = bookings.filter(booking => booking.status === status);
    }

    // Sort bookings
    if (sortBy === 'oldest') {
        bookings.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'amount-high') {
        bookings.sort((a, b) => b.totalPrice - a.totalPrice);
    } else if (sortBy === 'amount-low') {
        bookings.sort((a, b) => a.totalPrice - b.totalPrice);
    } else {
        bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Calculate statistics
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
    const totalRevenue = bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.totalPrice, 0);

    res.render("payment/dashboard.ejs", {
        bookings,
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        totalRevenue,
        filter: { status: status || '', sortBy: sortBy || 'newest' }
    });
}));

module.exports = router;
