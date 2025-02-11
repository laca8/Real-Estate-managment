const mongoose = require("mongoose");
const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
    },
    type: { type: String, required: true }, // apartment, house, villa, etc.
    status: { type: String, default: "available" }, // available, sold, rented
    features: [String],
    area: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    images: [String],
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "agent",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("property", propertySchema);
