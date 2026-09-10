# API Reference - Payment System

## Base URL
```
http://localhost:8080/payment
```

## Endpoints

### 1. Get Checkout Form
**GET** `/payment/:listingId/checkout`

Shows the checkout form with property details and payment form.

**Parameters:**
- `listingId` (URL) - ID of the listing to book
- `checkInDate` (Query) - Check-in date (YYYY-MM-DD)
- `checkOutDate` (Query) - Check-out date (YYYY-MM-DD)
- `numberOfNights` (Query) - Number of nights

**Example:**
```
GET /payment/507f1f77bcf86cd799439011/checkout?checkInDate=2024-01-15&checkOutDate=2024-01-20&numberOfNights=5
```

**Response:** EJS template rendered

---

### 2. Create Order & Payment Intent
**POST** `/payment/:listingId/checkout`

Creates an order in database and initiates Stripe payment.

**Parameters:**
- `listingId` (URL) - ID of the listing

**Request Body:**
```json
{
  "checkInDate": "2024-01-15",
  "checkOutDate": "2024-01-20",
  "numberOfNights": 5,
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+1234567890",
  "guestAddress": "123 Main St",
  "guestCity": "New York",
  "guestState": "NY",
  "guestZipCode": "10001",
  "guestCountry": "USA"
}
```

**Response Success (200):**
```json
{
  "orderId": "507f1f77bcf86cd799439011",
  "paymentId": "507f1f77bcf86cd799439012",
  "clientSecret": "pi_1234567890_secret_abcdef",
  "amount": 2500
}
```

**Response Error (400):**
```json
{
  "error": "Listing not found"
}
```

---

### 3. View Order Confirmation
**GET** `/payment/confirm/:orderId`

Shows order confirmation page with details and payment status.

**Parameters:**
- `orderId` (URL) - ID of the order

**Example:**
```
GET /payment/confirm/507f1f77bcf86cd799439011
```

**Response:** EJS template rendered

**Authorization:** Only order buyer can view

---

### 4. Check Payment Status
**GET** `/payment/status/:paymentIntentId`

Returns real-time payment status from Stripe.

**Parameters:**
- `paymentIntentId` (URL) - Stripe Payment Intent ID

**Example:**
```
GET /payment/status/pi_1234567890
```

**Response Success (200):**
```json
{
  "status": "succeeded",
  "orderId": "507f1f77bcf86cd799439011",
  "amount": 2500
}
```

**Response Error:**
```json
{
  "error": "Payment not found"
}
```

---

### 5. Cancel Order & Refund
**POST** `/payment/:orderId/cancel`

Cancels a booking and processes refund if payment succeeded.

**Parameters:**
- `orderId` (URL) - ID of the order

**Example:**
```
POST /payment/507f1f77bcf86cd799439011/cancel
```

**Response:** Redirects to /listings with success message

**Authorization:** Only order buyer can cancel

**Conditions:**
- Order must be in "pending" or "confirmed" status
- If confirmed, Stripe refund is processed

---

### 6. Get User's Bookings
**GET** `/payment/my-orders`

Lists all bookings made by the logged-in user.

**Example:**
```
GET /payment/my-orders
```

**Response:** EJS template with order list

**Authorization:** Requires login

**Filters Available:**
- By status (all/confirmed/pending/cancelled)
- Sort by date, status, or amount

---

### 7. Get Booking Dashboard
**GET** `/payment/dashboard`

Dashboard for property owners showing all bookings of their listings.

**Query Parameters:**
- `status` - Filter by status (confirmed/pending/cancelled)
- `sortBy` - Sort method (newest/oldest/amount-high/amount-low)

**Example:**
```
GET /payment/dashboard?status=confirmed&sortBy=amount-high
```

**Response:** EJS template with dashboard

**Authorization:** Requires login

**Statistics Shown:**
- Total bookings
- Confirmed bookings
- Total revenue
- Cancelled bookings

---

### 8. Stripe Webhook
**POST** `/payment/webhook`

Receives webhook events from Stripe about payment status.

**Headers:**
```
stripe-signature: t=timestamp,v1=signature
Content-Type: application/json
```

**Events Handled:**
- `payment_intent.succeeded` - Updates order to "confirmed"
- `payment_intent.payment_failed` - Updates order to "cancelled"

**Response:**
```json
{
  "received": true
}
```

**Authorization:** Stripe signature verification

---

## Database Models

### Order Model
```javascript
{
  _id: ObjectId,
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
  status: String, // "pending", "confirmed", "completed", "cancelled"
  createdAt: Date,
  updatedAt: Date
}
```

### Payment Model
```javascript
{
  _id: ObjectId,
  order: ObjectId (ref: Order),
  user: ObjectId (ref: User),
  amount: Number,
  currency: String, // default: "usd"
  paymentMethod: String, // "card", "upi", "wallet"
  stripePaymentIntentId: String,
  status: String, // "pending", "processing", "succeeded", "failed", "cancelled"
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

---

## Error Handling

### Authentication Errors
```
403 Forbidden
{
  "error": "You are not authorized to view this order!"
}
```

### Validation Errors
```
400 Bad Request
{
  "error": "Please select check-in and check-out dates"
}
```

### Not Found Errors
```
404 Not Found
{
  "error": "Listing not found"
}
```

### Stripe Errors
```
402 Payment Required
{
  "error": "Your card was declined"
}
```

---

## Stripe Test Cards

For testing without real charges:

| Card Number | Description | Result |
|------------|-------------|--------|
| 4242 4242 4242 4242 | Valid card | Succeeds |
| 4000 0000 0000 0002 | Generic decline | Fails |
| 4000 0025 0000 3155 | 3D Secure required | Authentication needed |

**For all test cards:**
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)
- Cardholder Name: Any name

---

## Workflow Example

### Complete Booking Flow

1. **User selects listing**
   ```
   GET /listings/507f1f77bcf86cd799439011
   ```

2. **User selects dates and clicks "Book"**
   ```
   Redirects to /payment/507f1f77bcf86cd799439011/checkout?...
   ```

3. **User fills checkout form and submits**
   ```
   POST /payment/507f1f77bcf86cd799439011/checkout
   Returns: { orderId, clientSecret, ... }
   ```

4. **Frontend confirms payment with Stripe**
   ```javascript
   stripe.confirmCardPayment(clientSecret, { ... })
   ```

5. **On success, redirect to confirmation**
   ```
   GET /payment/confirm/507f1f77bcf86cd799439011
   ```

6. **Stripe webhook updates database**
   ```
   POST /payment/webhook (Stripe sends event)
   Order status → "confirmed"
   ```

7. **User views bookings**
   ```
   GET /payment/my-orders
   ```

---

## Rate Limiting

- No built-in rate limiting
- Consider implementing for production
- Stripe has built-in rate limits

---

## CORS

- Not enabled by default
- Configure if frontend on different domain
- For same-domain requests: works out of box

---

## Pagination

- Not implemented in current version
- Consider adding for large datasets
- Use MongoDB `.skip()` and `.limit()`

---

## Versioning

Current API Version: **1.0**

---

## Support

For issues or questions:
1. Check PAYMENT_SYSTEM_SETUP.md
2. Review example requests above
3. Check Stripe documentation
4. Review console logs and error messages
