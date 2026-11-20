import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true },
    farmer: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, maxlength: 500, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
