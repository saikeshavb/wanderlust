const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    numberOfNights: {
        type: Number,
        required: true
    },
    pricePerNight: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    guestName: {
        type: String,
        required: true
    },
    guestEmail: {
        type: String,
        required: true
    },
    guestPhone: {
        type: String,
        required: true
    },
    guestAddress: {
        type: String,
        required: true
    },
    guestCity: {
        type: String,
        required: true
    },
    guestState: {
        type: String,
        required: true
    },
    guestZipCode: {
        type: String,
        required: true
    },
    guestCountry: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "completed", "cancelled"],
        default: "pending"
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

module.exports = mongoose.model("Order", orderSchema);
