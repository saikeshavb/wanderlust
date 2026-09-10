# Payment Flow - Step-by-Step Guide

## 📋 Complete User Journey

This document shows exactly what happens at each step of the payment process.

---

## 🏠 Step 1: Browse Listings

**URL:** `http://localhost:8080/listings`

**What Happens:**
- User sees all available properties
- Each property shows: image, title, price, location

**User Actions:**
- Click on a listing to view details

---

## 🔍 Step 2: View Listing Details

**URL:** `http://localhost:8080/listings/:id`

**What Happens:**
- Full property details displayed
- Owner information shown
- Reviews visible
- **NEW:** Booking section appears at top

**NEW Booking Section Shows:**
- Property price per night: `$500`
- Check-in date picker
- Check-out date picker
- "Number of Nights: 0"
- "Total Price: $0" (updates as you select dates)
- "Proceed to Book" button (green)
- OR "Login to Book" link (if not logged in)

**User Actions:**
1. Select check-in date (e.g., Jan 15)
2. Select check-out date (e.g., Jan 20)
3. See automatic calculation:
   - Number of Nights: 5
   - Total Price: $2500 (5 nights × $500)
4. Click "Proceed to Book" button

---

## 🛒 Step 3: Checkout Page

**URL:** `http://localhost:8080/payment/[listingId]/checkout`

**What the Page Shows:**

### Left Column - Order Summary
```
[Property Image]
Property Title
Description
📍 Location, Country

Booking Details
✓ Check-in: Jan 15, 2024
✓ Check-out: Jan 20, 2024
✓ Number of Nights: 5

Price Breakdown
Price per Night: $500
Subtotal: $2500
Service Fee: $0 (Free)
─────────────────
Total: $2500
```

### Right Column - Checkout Form

**Guest Information Section:**
```
Full Name:        [Text Input] *Required
Email:            [Email Input] *Required (pre-filled if logged in)
Phone Number:     [Tel Input] *Required
```

**Address Section:**
```
Street Address:   [Text Input] *Required
City:             [Text Input] *Required
State/Province:   [Text Input] *Required
ZIP/Postal Code:  [Text Input] *Required
Country:          [Text Input] *Required (pre-filled: USA)
```

**Payment Section:**
```
[Stripe Card Element]
- Card number input
- Expiry date input
- CVC input
- Real-time validation
- Error messages displayed below

[Pay $2500 Button] (Green, Full Width)
[Cancel Button] (Gray, Full Width)
```

**User Actions:**
1. Fill in all required fields
2. Enter card details:
   - Card Number: 4242 4242 4242 4242
   - Expiry: 12/25
   - CVC: 123
   - Name: John Doe
3. Click "Pay $2500" button

**Behind the Scenes:**
- Backend creates Order document
- Backend creates Payment intent with Stripe
- Frontend receives clientSecret
- Frontend sends card to Stripe for processing

---

## ✅ Step 4: Payment Processing

**Status:** Processing (1-3 seconds)

**What Happens:**
1. Stripe processes the card
2. Payment Intent status updates
3. Webhook notifies server (if set up)
4. Order status updates to "confirmed"
5. Payment status updates to "succeeded"

**Possible Outcomes:**
- ✅ Success - Proceed to Step 5
- ❌ Declined - Show error, allow retry
- ⚠️ 3D Secure - May require additional authentication

---

## 🎉 Step 5: Order Confirmation

**URL:** `http://localhost:8080/payment/confirm/:orderId`

**Success Message:**
```
✅ Payment Successful!
Your booking has been confirmed.
```

**Displayed Information:**

### Order Details Card
```
Order ID: 507f1f77bcf86cd799439011
Status: ✅ Confirmed (Green Badge)
```

### Property Information
```
Title: Beautiful Beach Villa
Location: Goa, India
Check-in: Jan 15, 2024
Check-out: Jan 20, 2024
Number of Nights: 5
```

### Guest Information
```
Name: John Doe
Email: john@example.com
Phone: +1234567890
Address: 123 Main St, New York, NY 10001, USA
```

### Payment Summary
```
Price per Night:           $500
Number of Nights:          5
Subtotal:                  $2500
Service Fee:               $0 (Free)
────────────────────────────────
Total Amount Paid:         $2500 (Green Text)

Transaction ID: pi_1234567890
Payment Date: Jan 10, 2024 10:35 AM
```

### Action Buttons
```
[Continue Browsing]     - Go back to listings
[My Bookings]           - View all your bookings
[Cancel Booking]        - Cancel and get refund (if eligible)
```

### Important Information Box
```
ℹ️ Important Information
• Confirmation email sent to john@example.com
• Please arrive 15 minutes before check-in
• Check-in: After 3:00 PM | Check-out: Before 11:00 AM
• Cancellations may be eligible for refund
```

**User Can:**
- Go back to browse more listings
- View all their bookings
- Cancel this booking (if eligible)

---

## 📋 Step 6: My Bookings Page

**URL:** `http://localhost:8080/payment/my-orders`

**Tab Navigation:**
```
[All Bookings (1)]  [Confirmed (1)]  [Pending (0)]  [Cancelled (0)]
```

**Booking Card Shows:**
```
[Property Image]

Property Name
📍 Location, Country

Check-in: Jan 15, 2024
Check-out: Jan 20, 2024
Nights: 5

Status: ✅ Confirmed (Green Badge)
Total: $2500 (Green)

[View Details] [Cancel]
```

**User Can:**
- View details of each booking
- Cancel confirmed bookings
- Filter by status
- See refund information

---

## 👨‍💼 Step 7: Owner Dashboard

**URL:** `http://localhost:8080/payment/dashboard`

**Statistics Cards:**
```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Total Bookings  │ │   Confirmed     │ │  Total Revenue  │ │  Cancellations  │
│       1         │ │       1         │ │     $2500       │ │        0        │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

**Filters:**
```
Status Filter: [All Status ▼]
Sort By: [Newest ▼]
[Apply Filters]
```

**Bookings Table:**
```
┌────────────┬──────────────┬───────────┬──────────┬────────┬─────────┬────────┬─────────┐
│Guest Name  │ Property     │ Check-in  │Check-out │Amount  │ Status  │ Date   │ Action  │
├────────────┼──────────────┼───────────┼──────────┼────────┼─────────┼────────┼─────────┤
│John Doe    │ Beach Villa  │ Jan 15    │ Jan 20   │$2500   │✅ Conf. │Jan 10  │[View]   │
│john@ex.com │              │           │          │        │         │        │         │
└────────────┴──────────────┴───────────┴──────────┴────────┴─────────┴────────┴─────────┘
```

**Owner Can:**
- See all bookings for their properties
- View performance metrics
- Filter and sort bookings
- Check payment amounts
- Click "View" to see full details

---

## 🔄 Step 8: Cancel Booking & Refund

**URL:** Any booking detail page

**User Clicks:** "Cancel Booking"

**Confirmation Dialog:**
```
Are you sure you want to cancel this booking?
This action cannot be undone.

[Yes, Cancel] [No, Keep Booking]
```

**What Happens:**
1. Refund sent to Stripe
2. Payment status → "cancelled"
3. Order status → "cancelled"
4. Amount: $2500 marked for refund
5. Timeline: 5-10 business days (Stripe)

**Success Message:**
```
✅ Order cancelled successfully!
```

**Booking Now Shows:**
```
Status: ❌ Cancelled (Red Badge)
Refund Status: In Progress
Refund Amount: $2500
Expected Date: 5-10 business days
```

---

## 🔐 Security & Authorization

**Authentication Checks:**
- Must be logged in to book
- Can only see own bookings
- Can only cancel own bookings
- Can only see own payment info

**Authorization Checks:**
- Booking buyer ✓ Can view/cancel
- Other users ✗ Denied access
- Property owner ✓ Can see in dashboard
- Other owners ✗ Cannot see others' bookings

**Payment Security:**
- Stripe handles card data (PCI compliant)
- No card numbers stored locally
- Webhook signature verified
- Data encrypted in transit

---

## 📊 Data Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│ CUSTOMER SELECTS DATES ON LISTING PAGE                  │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ FRONTEND CALCULATES PRICE & VALIDATES DATES             │
│ Shows: Number of Nights, Total Price                    │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ USER CLICKS "PROCEED TO BOOK"                           │
│ Redirected to /payment/:id/checkout                     │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ CUSTOMER FILLS CHECKOUT FORM & ENTERS CARD              │
│ - Guest information                                      │
│ - Address details                                        │
│ - Card number, expiry, CVC                              │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ BACKEND: POST /payment/:id/checkout                     │
│ 1. Create Order document in MongoDB                     │
│ 2. Create Payment document in MongoDB                   │
│ 3. Create Stripe Payment Intent                         │
│ 4. Return clientSecret to frontend                      │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ FRONTEND: Stripe Card Confirmation                      │
│ stripe.confirmCardPayment(clientSecret, cardDetails)    │
│ Sent to Stripe for processing                           │
└────────────────────┬─────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
      SUCCESS               DECLINED
          │                     │
          ▼                     ▼
    ┌─────────────┐     ┌──────────────┐
    │ Redirect to │     │ Show error   │
    │confirmation│     │message in    │
    │page        │     │form          │
    └─────────────┘     └──────────────┘
          │
          ▼
┌──────────────────────────────────────────────────────────┐
│ STRIPE WEBHOOK (Optional)                               │
│ POST /payment/webhook                                   │
│ Event: payment_intent.succeeded                         │
│ Updates Order & Payment status in MongoDB               │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ CONFIRMATION PAGE                                        │
│ GET /payment/confirm/:orderId                           │
│ Shows: Order details, booking info, payment receipt     │
└────────────────────┬─────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
      CONTINUE              CANCEL
    BROWSING BOOKINGS      BOOKING
          │                     │
          ▼                     ▼
    Go to                  POST /payment/:id/cancel
    /listings              1. Process Stripe refund
                          2. Update Order status
                          3. Update Payment status
                          4. User gets confirmation
```

---

## 🧪 Test Scenario

### Complete Test Flow (5 minutes)

1. **Create Listing**
   - Navigate to `/listings/new`
   - Fill in details
   - Create listing
   - Note the listing ID

2. **Create Booking**
   - Go to listing detail page
   - Select: Check-in Jan 15, Check-out Jan 20
   - Verify: 5 nights, $2500 total
   - Click "Proceed to Book"

3. **Checkout**
   - Fill in guest info
   - Enter card: 4242 4242 4242 4242
   - Expiry: 12/25, CVC: 123
   - Click "Pay $2500"

4. **Verify Confirmation**
   - Should see success message
   - Order ID displayed
   - Booking details shown
   - Click "My Bookings"

5. **Verify in Dashboard**
   - See booking listed
   - Status shows: Confirmed
   - Amount shows: $2500
   - Can click to view details

6. **Test Cancellation**
   - Click "Cancel Booking"
   - Confirm cancellation
   - See status change to Cancelled
   - See refund notice

7. **Check MongoDB**
   - Verify Order document created
   - Verify Payment document created
   - Check all fields populated

---

## 🎯 Quick Navigation

| Page | URL | Purpose |
|------|-----|---------|
| All Listings | `/listings` | Browse properties |
| Listing Detail | `/listings/:id` | View details & book |
| Checkout | `/payment/:id/checkout` | Payment form |
| Confirmation | `/payment/confirm/:id` | Payment receipt |
| My Bookings | `/payment/my-orders` | Booking history |
| Dashboard | `/payment/dashboard` | Owner analytics |
| Stripe Dashboard | https://dashboard.stripe.com | Manage payments |

---

## ✅ Verification Checklist

After implementing payment system:

- [ ] Server starts without errors
- [ ] Booking button appears on listing
- [ ] Date selection works
- [ ] Price calculation is correct
- [ ] Checkout form validates
- [ ] Stripe card element displays
- [ ] Payment processes successfully
- [ ] Confirmation page shows
- [ ] Order appears in My Bookings
- [ ] Dashboard shows booking
- [ ] Cancellation works
- [ ] Refund shows in Stripe dashboard
- [ ] MongoDB collections have data

---

## 🐛 Common Issues During Testing

| Issue | Solution |
|-------|----------|
| Stripe not loading | Check STRIPE_PUBLIC_KEY in .env |
| Card form empty | Refresh page, check browser console |
| Payment fails | Use test card 4242 4242 4242 4242 |
| Confirmation doesn't load | Check MongoDB connection |
| Dashboard is empty | Ensure you're logged in as owner |
| Booking button missing | User must be logged in |

---

## 📞 Support

- **Stripe Issues**: https://support.stripe.com
- **Documentation**: See FEATURES.md
- **Setup Help**: See QUICK_START.md
- **API Details**: See API_REFERENCE.md

---

**Ready to test your payment system? Start at Step 1! 🚀**
