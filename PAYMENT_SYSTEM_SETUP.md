# Complete Payment System Setup Guide

## Overview
This is a complete payment system implementation for your property rental application using Stripe. It includes order management, payment processing, webhooks, and a full checkout flow.

## Features Included

1. **Order Management**
   - Create and track orders with booking details
   - Store guest information
   - Track order status (pending, confirmed, completed, cancelled)

2. **Payment Processing**
   - Stripe integration for secure card payments
   - Payment intent creation and confirmation
   - Payment status tracking
   - Transaction recording

3. **Checkout Flow**
   - Date selection for check-in and check-out
   - Automatic price calculation
   - Secure card payment form
   - Order confirmation page

4. **User Features**
   - View all bookings
   - Filter bookings by status
   - Cancel bookings and refunds
   - Payment history

5. **Security**
   - Webhook verification for payment events
   - Authorization checks
   - Encrypted payment data

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

The new dependency added:
- `stripe@^14.11.0` - Stripe SDK for payment processing

### 2. Set Up Stripe Account
1. Go to https://dashboard.stripe.com
2. Sign up for a free account
3. Get your API keys from the dashboard:
   - Publishable Key (for frontend)
   - Secret Key (for backend)
   - Webhook Signing Secret (for webhooks)

### 3. Configure Environment Variables
Add these to your `.env` file:

```env
# Existing variables
ATLASDB_URL=your_mongodb_url
SECRET=your_session_secret
MAP_TOKEN=your_mapbox_token

# New Payment Variables
STRIPE_PUBLIC_KEY=pk_test_your_public_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 4. Database Models
Three new MongoDB models have been created:

**Order Model** (`models/order.js`):
- Stores booking information
- Tracks guest details
- Manages booking status

**Payment Model** (`models/payment.js`):
- Records payment transactions
- Tracks Stripe payment intent ID
- Stores payment status and details

**User Model** (extended):
- Already supports multiple orders/payments via references

### 5. API Routes
All payment routes are available at `/payment` prefix:

```
GET  /payment/:listingId/checkout        - Show checkout form
POST /payment/:listingId/checkout        - Process checkout (create order)
GET  /payment/confirm/:orderId           - View order confirmation
GET  /payment/status/:paymentIntentId    - Check payment status
POST /payment/:orderId/cancel            - Cancel order and refund
GET  /payment/my-orders                  - View user's bookings
POST /payment/webhook                    - Stripe webhook handler
```

## File Structure

```
/models/
  ├── order.js                 # Order schema and model
  ├── payment.js               # Payment schema and model
  └── (existing models)

/routes/
  ├── payment.js               # Payment routes and logic
  └── (existing routes)

/views/payment/
  ├── checkout.ejs             # Checkout form with Stripe card element
  ├── confirmation.ejs         # Order confirmation page
  └── my-orders.ejs            # User's booking history
```

## Payment Flow

### 1. Customer Browses Listings
- User views property details on `/listings/:id`

### 2. Book a Property
- Select check-in and check-out dates
- Click "Proceed to Book" button
- Automatically calculates number of nights and total price

### 3. Checkout
- Enter guest information (name, email, phone, address)
- Enter card details in secure Stripe form
- Click "Pay $X" button

### 4. Payment Processing
- Order is created in database with status "pending"
- Payment intent is created with Stripe
- Client confirms payment with card element
- Stripe processes the payment

### 5. Payment Confirmation
- If successful: Order status → "confirmed", Payment status → "succeeded"
- Webhook updates database records
- Customer sees confirmation page with all details

### 6. Post-Payment Options
- View booking details
- Cancel booking (if eligible for refund)
- View payment history

## Stripe Webhook Setup

Webhooks allow Stripe to notify your server about payment events.

### Local Testing (Development)
Use Stripe CLI to forward webhook events:

```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli

# Forward events to your local server
stripe listen --forward-to localhost:8080/payment/webhook

# Get the signing secret and add to .env as STRIPE_WEBHOOK_SECRET
```

### Production Webhook Setup
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/payment/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy signing secret to `.env`

## Testing the Payment System

### Test Cards
Stripe provides test card numbers:

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure Required**: 4000 0025 0000 3155

For any card:
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)

### Test Flow
1. Create a listing (or use existing)
2. Go to listing detail page
3. Select dates and click "Proceed to Book"
4. Fill in guest information
5. Enter test card number 4242 4242 4242 4242
6. Complete payment
7. View confirmation page

## Database Schema

### Order Schema
```javascript
{
  listing: ObjectId (ref: Listing),
  buyer: ObjectId (ref: User),
  checkInDate: Date,
  checkOutDate: Date,
  numberOfNights: Number,
  pricePerNight: Number,
  totalPrice: Number,
  guestName: String,
  guestEmail: String,
  guestPhone: String,
  guestAddress: String,
  guestCity: String,
  guestState: String,
  guestZipCode: String,
  guestCountry: String,
  status: String (pending/confirmed/completed/cancelled),
  createdAt: Date,
  updatedAt: Date
}
```

### Payment Schema
```javascript
{
  order: ObjectId (ref: Order),
  user: ObjectId (ref: User),
  amount: Number,
  currency: String (default: "usd"),
  paymentMethod: String (card/upi/wallet),
  stripePaymentIntentId: String,
  status: String (pending/processing/succeeded/failed/cancelled),
  transactionId: String,
  cardDetails: {
    last4: String,
    brand: String,
    expiryMonth: Number,
    expiryYear: Number
  },
  failureReason: String,
  paymentDate: Date,
  refundedAmount: Number,
  isRefunded: Boolean,
  refundDate: Date,
  metadata: Mixed,
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

The system handles various error scenarios:

1. **Missing Dates**: Redirects to listing page
2. **Invalid Order**: Returns 404 error
3. **Unauthorized Access**: Returns 403 Forbidden
4. **Payment Failures**: Records failure reason in database
5. **Card Errors**: Displays error message on checkout page

## Security Features

1. **Authorization Checks**
   - Only booking buyer can view/cancel their orders
   - Owner cannot book their own property

2. **Data Validation**
   - Date validation (check-out > check-in)
   - Price calculation verified
   - Guest information required

3. **Payment Security**
   - PCI compliance via Stripe
   - Webhook signature verification
   - HTTPS required in production

4. **Database Transactions**
   - Atomic order and payment creation
   - Consistent state updates via webhooks

## Environment Variables Reference

```env
# Database
ATLASDB_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Session
SECRET=your_random_secret_key

# Maps
MAP_TOKEN=your_mapbox_token

# Stripe (REQUIRED for payments)
STRIPE_PUBLIC_KEY=pk_test_or_pk_live_...
STRIPE_SECRET_KEY=sk_test_or_sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Node Environment
NODE_ENV=development
```

## Troubleshooting

### Payment Intent Error
**Error**: "No such PaymentIntent: pi_..."
- Check that STRIPE_SECRET_KEY is correct
- Ensure test/live keys match (don't mix test and live)

### Webhook Not Working
**Error**: Signature verification failed
- Ensure STRIPE_WEBHOOK_SECRET is correct
- Verify webhook endpoint is accessible
- Check that app.js has `express.raw()` middleware for webhook route

### Order Not Creating
**Error**: "Listing not found"
- Verify listing ID is correct
- Check listing exists in MongoDB

### Payment Confirmation Loop
**Issue**: Page keeps reloading
- Check browser console for JavaScript errors
- Verify Stripe public key is correct

## Production Checklist

Before deploying to production:

- [ ] Switch to live Stripe keys (pk_live_ and sk_live_)
- [ ] Update webhook endpoint to production URL
- [ ] Enable HTTPS for all payment pages
- [ ] Set NODE_ENV=production
- [ ] Test complete payment flow
- [ ] Set up error monitoring/logging
- [ ] Configure email notifications
- [ ] Test refund process
- [ ] Set up payment reconciliation

## API Documentation

### Create Checkout
```
POST /payment/:listingId/checkout

Body:
{
  checkInDate: "2024-01-15",
  checkOutDate: "2024-01-20",
  numberOfNights: 5,
  guestName: "John Doe",
  guestEmail: "john@example.com",
  guestPhone: "+1234567890",
  guestAddress: "123 Main St",
  guestCity: "New York",
  guestState: "NY",
  guestZipCode: "10001",
  guestCountry: "USA"
}

Response:
{
  orderId: "507f1f77bcf86cd799439011",
  paymentId: "507f1f77bcf86cd799439012",
  clientSecret: "pi_1234567890_secret_abcdef",
  amount: 2500
}
```

### Get Payment Status
```
GET /payment/status/:paymentIntentId

Response:
{
  status: "succeeded",
  orderId: "507f1f77bcf86cd799439011",
  amount: 2500
}
```

### Cancel Order
```
POST /payment/:orderId/cancel

Response: Redirect to /listings (with success message)
```

## Next Steps / Future Enhancements

1. **Email Notifications**
   - Send confirmation emails on successful payment
   - Send cancellation/refund emails

2. **Invoice Generation**
   - Generate PDF invoices
   - Store invoice history

3. **Subscription Support**
   - Monthly recurring bookings
   - Loyalty discounts

4. **Analytics**
   - Payment revenue dashboard
   - Booking trends

5. **Multiple Payment Methods**
   - Apple Pay / Google Pay
   - Bank transfers
   - UPI (for India)

6. **Advanced Features**
   - Payment plans / Installments
   - Group bookings with split payments
   - Payment hold (authorize only)

## Support

For Stripe-specific issues, visit:
- Documentation: https://stripe.com/docs
- Support: https://support.stripe.com
- API Reference: https://stripe.com/docs/api

For application issues, check:
- MongoDB Connection
- Environment variables
- Webhook configuration
- Browser console logs

---

**Version**: 1.0  
**Last Updated**: 2024  
**Status**: Production Ready
