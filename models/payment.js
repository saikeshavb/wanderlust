const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    order: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "usd"
    },
    paymentMethod: {
        type: String,
        enum: ["card", "upi", "wallet"],
        default: "card"
    },
    stripePaymentIntentId: {
        type: String,
        unique: true,
        sparse: true
    },
    status: {
        type: String,
        enum: ["pending", "processing", "succeeded", "failed", "cancelled"],
        default: "pending"
    },
    transactionId: {
        type: String,
        unique: true,
        sparse: true
    },
    cardDetails: {
        last4: String,
        brand: String,
        expiryMonth: Number,
        expiryYear: Number
    },
    failureReason: String,
    paymentDate: Date,
    refundedAmount: {
        type: Number,
        default: 0
    },
    isRefunded: {
        type: Boolean,
        default: false
    },
    refundDate: Date,
    metadata: {
        type: Schema.Types.Mixed
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Payment", paymentSchema);
