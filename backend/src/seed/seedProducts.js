import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

const products = [
  {
    name: "Gold Ring",
    price: 2500,
    image: "https://via.placeholder.com/300",
    description: "Elegant gold ring",
  },
  {
    name: "Silver Necklace",
    price: 1800,
    image: "https://via.placeholder.com/300",
    description: "Stylish silver necklace",
  },
  {
    name: "Diamond Earrings",
    price: 5200,
    image: "https://via.placeholder.com/300",
    description: "Premium diamond earrings",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log("Products seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
