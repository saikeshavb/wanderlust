# Payment System - Quick Reference Card

## 🚀 30-Second Setup

```bash
npm install
# Then edit .env with Stripe keys from https://dashboard.stripe.com
npm start
```

---

## 📍 Key URLs

| What | URL |
|-----|-----|
| Browse Properties | `http://localhost:8080/listings` |
| View Booking Button | `http://localhost:8080/listings/:id` |
| Checkout | `http://localhost:8080/payment/:id/checkout` |
| My Bookings | `http://localhost:8080/payment/my-orders` |
| Owner Dashboard | `http://localhost:8080/payment/dashboard` |
| Stripe Dashboard | `https://dashboard.stripe.com` |

---

## 💳 Test Card Numbers

```
✅ Success:           4242 4242 4242 4242
❌ Declined:         4000 0000 0000 0002
🔐 3D Secure:        4000 0025 0000 3155

For all: Expiry = 12/25, CVC = 123
```

---

## 📦 Files Created/Modified

### New Models
- `models/order.js` - Booking records
- `models/payment.js` - Payment transactions

### New Routes
- `routes/payment.js` - 8 API endpoints

### New Views
- `views/payment/checkout.ejs`
- `views/payment/confirmation.ejs`
- `views/payment/my-orders.ejs`
- `views/payment/dashboard.ejs`

### Modified Files
- `app.js` - Added payment router
- `package.json` - Added stripe dependency
- `views/listings/show.ejs` - Added booking section
- `.env.example` - Added Stripe keys template

### Documentation
- `QUICK_START.md` - 5-minute setup
- `PAYMENT_SYSTEM_SETUP.md` - Complete guide
- `API_REFERENCE.md` - API docs
- `FEATURES.md` - Feature details
- `PAYMENT_FLOW_GUIDE.md` - Step-by-step flow
- `IMPLEMENTATION_SUMMARY.md` - What was added

---

## 🎯 Test Flow (5 Minutes)

1. Go to `/listings` → View a listing → Select dates
2. Fill checkout form → Enter card `4242 4242 4242 4242`
3. Click "Pay" → See confirmation page
4. Go to `/payment/my-orders` → See your booking
5. Click "View Details" → See confirmation
6. Optional: Click "Cancel" to test refunds

---

## ⚙️ Environment Variables

```env
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # Optional
```

Get from: https://dashboard.stripe.com/apikeys

---

## 🔌 8 API Endpoints

```
GET  /payment/:listingId/checkout
POST /payment/:listingId/checkout
GET  /payment/confirm/:orderId
GET  /payment/status/:paymentIntentId
POST /payment/:orderId/cancel
GET  /payment/my-orders
GET  /payment/dashboard
POST /payment/webhook
```

---

## 📊 Database Models

### Order (Collections: `orders`)
```javascript
{
  listing, buyer,
  checkInDate, checkOutDate, numberOfNights,
  totalPrice, guestName, guestEmail, guestPhone,
  guestAddress, guestCity, guestState, guestZipCode,
  guestCountry, status, createdAt, updatedAt
}
```

### Payment (Collections: `payments`)
```javascript
{
  order, user, amount, currency, paymentMethod,
  stripePaymentIntentId, status, transactionId,
  cardDetails, failureReason, paymentDate,
  refundedAmount, isRefunded, refundDate, metadata,
  createdAt, updatedAt
}
```

---

## ✅ Features

- ✅ Date-based booking with auto price calc
- ✅ Secure Stripe payments (PCI compliant)
- ✅ Order tracking and management
- ✅ User booking history with filters
- ✅ Owner revenue dashboard
- ✅ Automatic refund processing
- ✅ Webhook support
- ✅ Full data validation
- ✅ Authorization checks

---

## 🔒 Security Features

- PCI compliant (Stripe handles cards)
- Authentication required
- Authorization checks
- Data validation
- Webhook signature verification
- No sensitive data stored locally

---

## 🧪 Stripe Test Cards

```
Visa: 4242 4242 4242 4242
MC: 5555 5555 5555 4444
Amex: 3782 822463 10005
Discover: 6011 1111 1111 1117

All: exp=12/25, cvc=123
```

---

## 🐛 Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| "Stripe is not defined" | Check STRIPE_PUBLIC_KEY in .env |
| Checkout won't load | Check STRIPE_SECRET_KEY |
| Payment fails | Use card 4242 4242 4242 4242 |
| Order not created | Check MongoDB connection |
| Dates won't select | Browser cache? Try ctrl+F5 |

---

## 📚 Documentation

| Document | Read For |
|----------|----------|
| QUICK_START.md | Fast setup (5 min) |
| PAYMENT_SYSTEM_SETUP.md | Complete setup |
| API_REFERENCE.md | API documentation |
| FEATURES.md | Feature details |
| PAYMENT_FLOW_GUIDE.md | Step-by-step UI flow |

---

## 💡 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Get Stripe keys from dashboard
3. ✅ Update .env file
4. ✅ Restart server: `npm start`
5. ✅ Test with test cards
6. ⬜ (Optional) Set up webhooks
7. ⬜ (Optional) Add email notifications
8. ⬜ (Production) Switch to live keys

---

## 🎓 Key Concepts

| Concept | Explanation |
|---------|-------------|
| Order | A booking with dates and guest info |
| Payment | Payment transaction for an order |
| Payment Intent | Stripe object for processing payment |
| Webhook | Server notification from Stripe |
| Refund | Money returned to customer card |

---

## 🌐 Important URLs

| Type | URL |
|------|-----|
| Stripe Dashboard | https://dashboard.stripe.com |
| API Keys | https://dashboard.stripe.com/apikeys |
| Webhooks | https://dashboard.stripe.com/webhooks |
| Test Data | https://stripe.com/docs/testing |
| Docs | https://stripe.com/docs |

---

## 📱 Frontend Flow

```
Listing Detail
  ↓ [Select dates + Click "Proceed"]
Checkout Page
  ↓ [Enter info + Card + Click "Pay"]
Stripe Payment
  ↓ [Process payment]
Confirmation Page
  ↓ [Payment result]
My Bookings
  ↓ [View all bookings]
Dashboard
  ↓ [Owner sees revenue]
```

---

## 🔑 Critical Files

- `routes/payment.js` - All payment logic
- `models/order.js` - Order data
- `models/payment.js` - Payment data
- `views/payment/checkout.ejs` - Payment form
- `app.js` - Routes registration

---

## 📊 Statistics Tracked

- Total bookings count
- Confirmed bookings count
- Total revenue (sum of confirmed)
- Cancelled bookings count
- Payment success rate
- Average booking value

---

## 🎉 You Now Have

✅ Complete booking system  
✅ Secure payment processing  
✅ Order management  
✅ User dashboards  
✅ Owner analytics  
✅ Refund handling  
✅ Production-ready code  

---

## 💬 Quick Answers

**Q: Do I need to store credit cards?**  
A: No! Stripe handles all card data.

**Q: Can users see each other's bookings?**  
A: No! Authorization prevents this.

**Q: How long until refund?**  
A: Stripe takes 5-10 business days.

**Q: Can I test without real money?**  
A: Yes! Use test cards - no charges.

**Q: Do I need live keys now?**  
A: No! Start with test keys, switch later.

---

## 🚀 You're Ready!

Everything is implemented and documented.  
Start with `QUICK_START.md` for setup.  
Test with card `4242 4242 4242 4242`.  
Read docs for details.

**Happy coding! 🎉**
