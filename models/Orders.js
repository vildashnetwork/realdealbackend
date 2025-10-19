import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  user: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "NormalUser", required: true },
    name: { type: String, required: true },
    number: { type: String, required: true },
    address: { type: String, required: true },
    location: { type: String, required: true },
    country: { type: String, required: true },
    email: { type: String, required: true }
  },
  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "FishingTool", required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  paymentmethod: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  ZIPCode: { type: String, required: true },
  State: { type: String, required: true }

}, { timestamps: true });

export default mongoose.model("Order", OrderSchema);
