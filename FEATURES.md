# Payment System - Complete Feature Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Core Features](#core-features)
3. [User Features](#user-features)
4. [Security Features](#security-features)
5. [Data Management](#data-management)
6. [Integration Points](#integration-points)

---

## Overview

This is a complete, production-ready payment processing system for property rental bookings. It integrates Stripe for secure payments, MongoDB for data persistence, and provides a full user interface for booking management.

**Technology Stack:**
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Payment Processing: Stripe API
- Frontend: EJS Templating
- Security: Passport.js (authentication)

---

## Core Features

### 1. 🏠 Property Booking System

**Feature:** Users can book properties for specific dates.

**Components:**
- Date selection with validation
- Automatic price calculation
- Booking duration tracking

**User Flow:**
1. Browse listings
2. View property details
3. Select check-in and check-out dates
4. System calculates nights and total price
5. Proceed to payment

**Data Stored:**
- Check-in/check-out dates
- Number of nights
- Calculated total price
- Property information

**File Reference:** [views/listings/show.ejs](views/listings/show.ejs)

---

### 2. 💳 Secure Payment Processing

**Feature:** Process payments securely using Stripe.

**Components:**
- Stripe Card Element (PCI compliant)
- Payment Intent creation
- Real-time payment confirmation

**Security:**
- All card data handled by Stripe
- No card numbers stored in database
- SSL/TLS encryption
- Webhook signature verification

**Payment Methods Supported:**
- Credit Cards (Visa, Mastercard, Amex, etc.)
- Debit Cards
- Digital Wallets (via Stripe)

**Supported Currencies:**
- USD (default)
- Extensible to other currencies

**File Reference:** [routes/payment.js](routes/payment.js)

---

### 3. 📦 Order Management

**Feature:** Track and manage all bookings.

**Capabilities:**
- Create orders with booking details
- Store guest information
- Track order status
- Calculate total amounts

**Order Statuses:**
- `pending` - Order created, awaiting payment
- `confirmed` - Payment successful, booking confirmed
- `completed` - Stay completed
- `cancelled` - Order cancelled by user

**Guest Information Collected:**
- Full name
- Email address
- Phone number
- Street address
- City and state
- ZIP/Postal code
- Country

**File Reference:** [models/order.js](models/order.js)

---

### 4. 💰 Payment Tracking

**Feature:** Maintain detailed payment records.

**Recorded Information:**
- Payment amount and currency
- Stripe payment intent ID
- Payment status
- Transaction ID
- Card details (last 4 digits, brand, expiry)
- Payment timestamp
- Refund information

**Payment Statuses:**
- `pending` - Payment initiated
- `processing` - Payment being processed
- `succeeded` - Payment successful
- `failed` - Payment declined
- `cancelled` - Payment cancelled

**File Reference:** [models/payment.js](models/payment.js)

---

### 5. 🔄 Refund Management

**Feature:** Process refunds for cancelled bookings.

**Capabilities:**
- Cancel confirmed bookings
- Automatic Stripe refund processing
- Track refunded amounts
- Record refund dates

**Refund Rules:**
- Can only refund confirmed bookings
- Full refund processed
- Automatically recorded in database
- User gets refund confirmation

**Refund Timeline:**
- Stripe processes refund within 5-10 business days
- Database updated immediately

**Example:**
```javascript
// Automatic refund on cancellation
const refund = await stripe.refunds.create({
  payment_intent: payment.stripePaymentIntentId
});
```

---

### 6. 📧 Guest Information Handling

**Feature:** Collect and store guest details securely.

**Information Types:**
1. **Contact Information**
   - Name, email, phone

2. **Address Information**
   - Street address, city, state
   - ZIP code, country

3. **Booking Information**
   - Check-in/out dates
   - Number of nights
   - Total amount

**Data Protection:**
- Stored in MongoDB
- Associated with order
- Accessible only to buyer
- No sensitive payment data stored

---

## User Features

### 1. 🎫 My Bookings

**Feature:** View all personal bookings.

**URL:** `/payment/my-orders`

**Capabilities:**
- List all bookings made by user
- Filter by status (all, confirmed, pending, cancelled)
- View booking details
- See payment amounts
- Cancel bookings

**Tab Organization:**
- All Bookings - Complete list
- Confirmed - Successful bookings
- Pending - Awaiting payment
- Cancelled - Cancelled bookings

**Information Displayed:**
- Property photo
- Property name and location
- Check-in/out dates
- Number of nights
- Total amount paid
- Booking status
- Action buttons

**File Reference:** [views/payment/my-orders.ejs](views/payment/my-orders.ejs)

---

### 2. 📊 Booking Dashboard (For Owners)

**Feature:** Dashboard for property owners to manage bookings.

**URL:** `/payment/dashboard`

**Statistics:**
- Total number of bookings
- Confirmed bookings count
- Total revenue
- Cancelled bookings count

**Features:**
- Filter by booking status
- Sort by date or amount
- View all bookings for owned properties
- Click to view detailed booking info

**Information Shown per Booking:**
- Guest name and email
- Property name
- Check-in and check-out dates
- Booking amount
- Booking status
- Date booked
- Action link

**Sorting Options:**
- Newest first
- Oldest first
- Amount (High to Low)
- Amount (Low to High)

**File Reference:** [views/payment/dashboard.ejs](views/payment/dashboard.ejs)

---

### 3. ✅ Order Confirmation

**Feature:** Detailed confirmation page after payment.

**URL:** `/payment/confirm/:orderId`

**Displayed Information:**
- Payment success/failure status
- Order ID
- Property details with photo
- Booking dates
- Number of nights
- Guest information
- Price breakdown
- Transaction ID
- Payment date

**Actions Available:**
- View property listing
- View my bookings
- Cancel booking (if applicable)
- Download confirmation (future feature)

**File Reference:** [views/payment/confirmation.ejs](views/payment/confirmation.ejs)

---

### 4. 📱 Checkout Form

**Feature:** User-friendly checkout process.

**URL:** `/payment/:listingId/checkout`

**Form Sections:**
1. **Order Summary**
   - Property image
   - Property title and description
   - Location
   - Booking dates
   - Price per night
   - Number of nights
   - Total price

2. **Guest Information**
   - Full name (required)
   - Email (required)
   - Phone number (required)
   - Street address (required)
   - City (required)
   - State/Province (required)
   - ZIP/Postal code (required)
   - Country (required)

3. **Payment Section**
   - Secure Stripe card element
   - Real-time validation
   - Error messaging
   - Pay button with amount

**Validation:**
- All fields required
- Email format validation
- Phone number format
- Date validation

**File Reference:** [views/payment/checkout.ejs](views/payment/checkout.ejs)

---

## Security Features

### 1. 🔐 Authentication & Authorization

**Implemented:**
- User must be logged in to book
- Only booking buyer can view/cancel their orders
- Only property owner can view their dashboard
- Session-based authentication

**Middleware:** `isLoggedIn`

```javascript
// Only logged-in users can access
router.get("/payment/my-orders", isLoggedIn, (req, res) => { ... });
```

---

### 2. 🛡️ Payment Security

**Stripe Features Used:**
- Payment Intents API (SCA/3DS ready)
- Secure card tokenization
- PCI DSS Level 1 compliance
- Fraud detection

**Implementation:**
- No card data stored locally
- Card processing via Stripe
- Secure client secret transmission
- HTTPS required

---

### 3. ✔️ Webhook Verification

**Feature:** Verify events really come from Stripe.

**Implementation:**
```javascript
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET
);
```

**Prevents:**
- Forged payment notifications
- Unauthorized order confirmations
- Payment status manipulation

---

### 4. 🔑 API Key Security

**Best Practices:**
- Public key in frontend only
- Secret key in backend only
- Webhook secret in environment variables
- Never commit keys to git

**File Reference:** `.env.example`

---

### 5. 📝 Data Validation

**On Checkout:**
- Check-out date > check-in date
- All required fields filled
- Valid email format
- Phone number format
- Positive number of nights

**On Payment:**
- Order exists
- Payment intent valid
- Amount matches

---

### 6. 🚫 Authorization Checks

**Order Access:**
- Only buyer can view own orders
- Unauthorized access returns 403

**Cancellation:**
- Only buyer can cancel
- Can't cancel already completed orders
- Can't cancel already cancelled orders

---

## Data Management

### 1. 📚 Order Data Structure

**Collections:** `orders` (MongoDB)

**Example Document:**
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  listing: ObjectId("507f1f77bcf86cd799439013"),
  buyer: ObjectId("507f1f77bcf86cd799439012"),
  checkInDate: ISODate("2024-01-15T00:00:00Z"),
  checkOutDate: ISODate("2024-01-20T00:00:00Z"),
  numberOfNights: 5,
  pricePerNight: 500,
  totalPrice: 2500,
  guestName: "John Doe",
  guestEmail: "john@example.com",
  guestPhone: "+1234567890",
  guestAddress: "123 Main St",
  guestCity: "New York",
  guestState: "NY",
  guestZipCode: "10001",
  guestCountry: "USA",
  status: "confirmed",
  createdAt: ISODate("2024-01-10T10:30:00Z"),
  updatedAt: ISODate("2024-01-10T10:35:00Z")
}
```

---

### 2. 💳 Payment Data Structure

**Collections:** `payments` (MongoDB)

**Example Document:**
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439014"),
  order: ObjectId("507f1f77bcf86cd799439011"),
  user: ObjectId("507f1f77bcf86cd799439012"),
  amount: 2500,
  currency: "usd",
  paymentMethod: "card",
  stripePaymentIntentId: "pi_1234567890",
  status: "succeeded",
  transactionId: "pi_1234567890",
  cardDetails: {
    last4: "4242",
    brand: "visa",
    expiryMonth: 12,
    expiryYear: 2025
  },
  failureReason: null,
  paymentDate: ISODate("2024-01-10T10:35:00Z"),
  refundedAmount: 0,
  isRefunded: false,
  refundDate: null,
  metadata: { },
  createdAt: ISODate("2024-01-10T10:30:00Z"),
  updatedAt: ISODate("2024-01-10T10:35:00Z")
}
```

---

### 3. 🔗 Data Relationships

**ERD (Entity Relationship Diagram):**
```
┌─────────────────────────────────────┐
│ User                                 │
├─────────────────────────────────────┤
│ _id (PK)                             │
│ username                             │
│ email                                │
└─────────┬───────────────┬───────────┘
          │               │
          │ (1 buyer)     │ (1 owner)
          │               │
┌─────────▼────────────┐  │
│ Order                │  │
├──────────────────────┤  │
│ _id (PK)             │  │
│ buyer_id (FK)◄──────┘  │
│ owner_id (FK)◄────────┘
│ listing_id (FK)      │
│ [guest details]      │
└──────────┬───────────┘
           │
           │ (1 order)
           │
┌──────────▼────────────┐
│ Payment              │
├──────────────────────┤
│ _id (PK)             │
│ order_id (FK)◄───────┘
│ user_id (FK)         │
│ [payment details]    │
└──────────────────────┘
```

---

### 4. 📊 Queries

**Find all bookings for a user:**
```javascript
Order.find({ buyer: userId })
  .populate('listing')
  .sort({ createdAt: -1 })
```

**Find all bookings for user's properties:**
```javascript
const userListings = await Listing.find({ owner: userId });
const bookings = await Order.find({ listing: { $in: listingIds } });
```

**Calculate revenue:**
```javascript
const revenue = await Order.aggregate([
  { $match: { status: 'confirmed' } },
  { $group: { _id: null, total: { $sum: '$totalPrice' } } }
]);
```

---

## Integration Points

### 1. 📡 Stripe Integration

**Services Used:**
- Payment Intents API
- Webhooks
- Card Elements
- Refunds

**File Reference:** [routes/payment.js](routes/payment.js)

---

### 2. 🗄️ MongoDB Integration

**Collections Used:**
- `orders` - Booking records
- `payments` - Payment records
- `listings` - Property details
- `users` - User accounts
- `reviews` - Property reviews

**Connection:** Via Mongoose ODM

---

### 3. 🎨 Frontend Integration

**Technologies:**
- EJS Templates
- Bootstrap CSS
- Stripe.js (client-side)
- Vanilla JavaScript

**Views Created:**
- [checkout.ejs](views/payment/checkout.ejs)
- [confirmation.ejs](views/payment/confirmation.ejs)
- [my-orders.ejs](views/payment/my-orders.ejs)
- [dashboard.ejs](views/payment/dashboard.ejs)

---

### 4. 🛣️ Route Integration

**Routes Registered:** `/payment` prefix

```javascript
app.use("/payment", paymentRouter);
```

**Routes Available:**
- GET `/payment/:listingId/checkout`
- POST `/payment/:listingId/checkout`
- GET `/payment/confirm/:orderId`
- GET `/payment/status/:paymentIntentId`
- POST `/payment/:orderId/cancel`
- GET `/payment/my-orders`
- GET `/payment/dashboard`
- POST `/payment/webhook`

---

## Performance Considerations

### 1. Database Indexing
**Recommended Indexes:**
```javascript
// Orders
db.orders.createIndex({ buyer: 1 });
db.orders.createIndex({ listing: 1 });
db.orders.createIndex({ status: 1 });

// Payments
db.payments.createIndex({ order: 1 });
db.payments.createIndex({ user: 1 });
db.payments.createIndex({ stripePaymentIntentId: 1 });
```

### 2. Caching Opportunities
- Cache listing details
- Cache user bookings (with TTL)
- Cache dashboard statistics

### 3. Async Processing
- Refunds processed async
- Webhooks handled async
- Email notifications (future)

---

## Future Enhancements

1. **Email Notifications**
   - Booking confirmation
   - Payment receipt
   - Cancellation notice
   - Refund notification

2. **Analytics & Reporting**
   - Revenue dashboards
   - Booking trends
   - Guest analytics

3. **Additional Payment Methods**
   - Apple Pay
   - Google Pay
   - Bank transfers
   - Cryptocurrency

4. **Advanced Booking**
   - Monthly subscriptions
   - Group bookings
   - Payment plans

5. **Admin Features**
   - Manual order creation
   - Payment adjustments
   - Dispute management

6. **Mobile App**
   - React Native app
   - Mobile payment UI
   - Push notifications

---

## Deployment Checklist

- [ ] Update to live Stripe keys
- [ ] Set up webhook endpoint
- [ ] Enable HTTPS/SSL
- [ ] Test email notifications
- [ ] Configure error monitoring
- [ ] Set up database backups
- [ ] Load testing
- [ ] Security audit
- [ ] Final payment test

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024 | Initial release with core features |

---

## Support & Documentation

- **Quick Start:** [QUICK_START.md](QUICK_START.md)
- **Setup Guide:** [PAYMENT_SYSTEM_SETUP.md](PAYMENT_SYSTEM_SETUP.md)
- **API Reference:** [API_REFERENCE.md](API_REFERENCE.md)
- **Stripe Docs:** https://stripe.com/docs

---

**Your payment system is ready for production! 🚀**
