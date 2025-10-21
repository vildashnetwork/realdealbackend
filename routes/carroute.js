import express from "express";
import FishingTool from "../models/Cars.js"; // Make sure your model is correctly named Cars.js or FishingTool.js

const router = express.Router();

// 🔹 CREATE Fishing Tool
router.post("/", async (req, res) => {
  try {
    const {
      ProductName,
      SKU,
      Description,
      Specifications,
      Price,
      CompareatPrice,
      Weight,
      Category,
      StockQuantity,
      img3,
      img2,
      img4,
      img5,
      img6
    } = req.body;

    // Validate required fields
    if (
      !ProductName ||
      !SKU ||
      !Description ||
      !Specifications ||
      !Price ||
      !Weight ||
      !Category ||
      !StockQuantity ||
      !img3
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newFishingTool = new FishingTool({
      ProductName,
      SKU,
      Description,
      Specifications,
      Price,
      CompareatPrice ,
      Weight,
      Category,
      StockQuantity,
      img3,
      img2,
      img4,
      img5,
      img6
    });

const savedFishingTool = await newFishingTool.save();
res.status(201).json({
  message: "Fishing tool added successfully",
  fishingTool: savedFishingTool,
});
  } catch (err) {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}
});

// 🔹 GET All Fishing Tools
router.get("/", async (req, res) => {
  try {
    const fishingTools = await FishingTool.find().sort({ createdAt: -1 });
    res.status(200).json({ fishingTools });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🔹 GET One Fishing Tool by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fishingTool = await FishingTool.findById(id);

    if (!fishingTool) {
      return res.status(404).json({ message: "Fishing tool not found" });
    }

    res.status(200).json({ fishingTool });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🔹 UPDATE Fishing Tool
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFishingTool = await FishingTool.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedFishingTool) {
      return res.status(404).json({ message: "Fishing tool not found" });
    }

    res.status(200).json({
      message: "Fishing tool updated successfully",
      fishingTool: updatedFishingTool,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🔹 DELETE Fishing Tool
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFishingTool = await FishingTool.findByIdAndDelete(id);

    if (!deletedFishingTool) {
      return res.status(404).json({ message: "Fishing tool not found" });
    }

    res.status(200).json({
      message: "Fishing tool deleted successfully",
      fishingTool: deletedFishingTool,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
