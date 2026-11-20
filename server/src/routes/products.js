import { Router } from "express";
import Product from "../models/Product.js";

const router = Router();

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

router.get("/", async (request, response) => {
  const { search = "", category = "" } = request.query;
  const filter = {};

  if (typeof search === "string" && search.trim()) {
    const query = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [{ name: query }, { category: query }, { farmer: query }, { location: query }];
  }
  if (typeof category === "string" && category.trim() && category !== "All") {
    filter.category = category.trim();
  }

  const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
  response.json(products);
});

router.post("/", async (request, response) => {
  const product = await Product.create(request.body);
  response.status(201).json(product);
});

export default router;
