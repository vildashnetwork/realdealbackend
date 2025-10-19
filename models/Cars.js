import mongoose from "mongoose"

const CarSchema = new mongoose.Schema(
    {
        ProductName: { type: String, required: true },
        SKU: { type: String, required: true },
        Description: { type: String, required: true },
        Specifications: { type: String, required: true },
        Price: { type: String, required: true },
        CompareatPrice: { type: String, required: true },
        Weight: { type: String, required: true },
        Category: { type: String, required: true },
        StockQuantity: { type: String, required: true },
        img3: { type: String, required: true }
    },
    { timestamps: true }
);


const FishingTool = mongoose.model("FishingTool", CarSchema)

export default FishingTool