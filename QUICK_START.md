# Payment System - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Stripe Dependency
```bash
npm install
```

### Step 2: Get Stripe API Keys
1. Go to https://dashboard.stripe.com
2. Click "Developers" in the top menu
3. Click "API Keys"
4. Copy your **Publishable Key** and **Secret Key**

### Step 3: Update .env File
Copy `.env.example` to `.env` and add your Stripe keys:
```env
STRIPE_PUBLIC_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_key_here  # Add this later for webhooks
```

### Step 4: Restart Your Server
```bash
npm start  # or nodemon
```

## 🧪 Test the Payment Flow

### 1. Create a Listing
- Go to http://localhost:8080/listings
- Click "Create New Listing"
- Fill in details and create a listing

### 2. Book the Listing
- Go to your listing detail page
- Select check-in and check-out dates
- Click "Proceed to Book"

### 3. Complete Checkout
- Fill in guest information
- Use test card: **4242 4242 4242 4242**
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)
- Click "Pay"

### 4. Confirm Payment
- You should see a confirmation page
- Go to http://localhost:8080/payment/my-orders to see your bookings

## 📍 Key URLs

| Purpose | URL |
|---------|-----|
| Browse listings | http://localhost:8080/listings |
| Create listing | http://localhost:8080/listings/new |
| View your bookings | http://localhost:8080/payment/my-orders |
| Booking dashboard | http://localhost:8080/payment/dashboard |
| Stripe dashboard | https://dashboard.stripe.com |

## 🧰 Test Scenarios

### Successful Payment
- Card: `4242 4242 4242 4242`
- Result: Payment succeeds, booking confirmed

### Declined Card
- Card: `4000 0000 0000 0002`
- Result: Payment fails, error displayed

### 3D Secure (SCA)
- Card: `4000 0025 0000 3155`
- Result: Requires additional authentication

## 📊 What Gets Created

When a user completes a booking:

### Order Document (MongoDB)
```javascript
{
  _id: ObjectId,
  listing: ObjectId,
  buyer: ObjectId,
  checkInDate: "2024-01-15",
  checkOutDate: "2024-01-20",
  numberOfNights: 5,
  totalPrice: 2500,
  guestName: "John Doe",
  guestEmail: "john@example.com",
  status: "confirmed",
  createdAt: Date
}
```

### Payment Document (MongoDB)
```javascript
{
  _id: ObjectId,
  order: ObjectId,
  user: ObjectId,
  amount: 2500,
  stripePaymentIntentId: "pi_1234567890",
  status: "succeeded",
  transactionId: "pi_1234567890",
  paymentDate: Date
}
```

## 🔧 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Stripe is not defined" | Check STRIPE_PUBLIC_KEY in .env |
| "No such PaymentIntent" | Ensure STRIPE_SECRET_KEY is correct |
| Card doesn't process | Use test card 4242 4242 4242 4242 |
| Dates won't select | Make sure using modern browser |

## 📧 Important Notes

- **Test Mode**: All test cards will never charge your account
- **Security**: All card data is handled by Stripe (PCI compliant)
- **Webhooks**: Optional but recommended for production
- **Data**: Order and payment info stored in MongoDB

## 🎯 Next Steps

1. ✅ Complete setup steps above
2. ✅ Test with a sample booking
3. ✅ Check database to verify data saved
4. ✅ Test cancellation/refund feature
5. ⬜ Set up webhook handling (production)
6. ⬜ Add email notifications
7. ⬜ Deploy to production with live keys

## 📞 Need Help?

- **Stripe Docs**: https://stripe.com/docs
- **Payment Routes**: Check `routes/payment.js`
- **Models**: Check `models/order.js` and `models/payment.js`
- **Views**: Check `views/payment/` directory

---

**That's it! Your payment system is ready to use.** 🎉
