// src/data/categories.ts
import { ProductCategory } from "../types";

export const CATEGORIES: ProductCategory[] = [
  {
    id: "smartphones",
    name: "Smartphones & Mobile",
    duty_bracket: "electronics",
    shipping_weight_factor: 0.4,
    typical_margin_min: 0.20,
    typical_margin_max: 0.35,
    demand_sensitivity: 0.12,
    examples: [
      "iPhone", "Samsung Galaxy", "Google Pixel",
      "OnePlus", "Xiaomi", "Oppo", "Vivo"
    ]
  },
  {
    id: "laptops",
    name: "Laptops & Computers",
    duty_bracket: "electronics",
    shipping_weight_factor: 0.8,
    typical_margin_min: 0.15,
    typical_margin_max: 0.30,
    demand_sensitivity: 0.10,
    examples: [
      "MacBook", "Dell XPS", "HP Spectre",
      "Lenovo ThinkPad", "ASUS ROG", "Surface"
    ]
  },
  {
    id: "televisions",
    name: "Televisions & Displays",
    duty_bracket: "electronics",
    shipping_weight_factor: 2.5,
    typical_margin_min: 0.18,
    typical_margin_max: 0.28,
    demand_sensitivity: 0.08,
    examples: [
      "LG OLED", "Samsung QLED",
      "Sony Bravia", "TCL", "Hisense"
    ]
  },
  {
    id: "appliances",
    name: "Home Appliances",
    duty_bracket: "electronics",
    shipping_weight_factor: 8.0,
    typical_margin_min: 0.18,
    typical_margin_max: 0.25,
    demand_sensitivity: 0.07,
    examples: [
      "Refrigerator", "Washing Machine",
      "Air Conditioner", "Microwave", "Dishwasher"
    ]
  },
  {
    id: "clothing",
    name: "Clothing & Footwear",
    duty_bracket: "clothing",
    shipping_weight_factor: 0.3,
    typical_margin_min: 0.40,
    typical_margin_max: 0.65,
    demand_sensitivity: 0.15,
    examples: [
      "Nike Shoes", "Adidas", "Zara",
      "H&M", "Levi Jeans", "Ray Ban"
    ]
  },
  {
    id: "packaged_food",
    name: "Packaged Food & Beverages",
    duty_bracket: "food",
    shipping_weight_factor: 1.0,
    typical_margin_min: 0.25,
    typical_margin_max: 0.45,
    demand_sensitivity: 0.05,
    examples: [
      "Coca-Cola", "Lay's Chips",
      "Nutella", "Oreo", "Nescafe"
    ]
  },
  {
    id: "fresh_food",
    name: "Fresh Food & Produce",
    duty_bracket: "food",
    shipping_weight_factor: 1.5,
    typical_margin_min: 0.20,
    typical_margin_max: 0.35,
    demand_sensitivity: 0.10,
    examples: [
      "Rice", "Wheat", "Vegetables",
      "Fruits", "Dairy", "Eggs"
    ]
  },
  {
    id: "fuel",
    name: "Fuel & Energy",
    duty_bracket: "fuel",
    shipping_weight_factor: 0.1,
    typical_margin_min: 0.05,
    typical_margin_max: 0.15,
    demand_sensitivity: 0.03,
    examples: [
      "Petrol/Gasoline", "Diesel",
      "LPG Cooking Gas", "Electricity (kWh)"
    ]
  },
  {
    id: "generic_medicine",
    name: "Generic Medicines",
    duty_bracket: "medicine",
    shipping_weight_factor: 0.1,
    typical_margin_min: 0.20,
    typical_margin_max: 0.40,
    demand_sensitivity: 0.04,
    examples: [
      "Paracetamol", "Ibuprofen",
      "Amoxicillin", "Aspirin", "Vitamins"
    ]
  },
  {
    id: "branded_medicine",
    name: "Branded Medicines",
    duty_bracket: "medicine",
    shipping_weight_factor: 0.1,
    typical_margin_min: 0.30,
    typical_margin_max: 0.80,
    demand_sensitivity: 0.06,
    examples: [
      "Lipitor", "Humira", "Keytruda",
      "Insulin brands", "Vaccines"
    ]
  },
  {
    id: "automobiles",
    name: "Automobiles & Vehicles",
    duty_bracket: "auto",
    shipping_weight_factor: 20.0,
    typical_margin_min: 0.08,
    typical_margin_max: 0.20,
    demand_sensitivity: 0.09,
    examples: [
      "Toyota Camry", "Honda Civic",
      "BMW 3 Series", "Tesla Model 3"
    ]
  },
  {
    id: "books",
    name: "Books & Education",
    duty_bracket: "books",
    shipping_weight_factor: 0.5,
    typical_margin_min: 0.30,
    typical_margin_max: 0.50,
    demand_sensitivity: 0.08,
    examples: [
      "Textbooks", "Novels",
      "Stationery", "School Supplies"
    ]
  },
  {
    id: "personal_care",
    name: "Personal Care & Beauty",
    duty_bracket: "general",
    shipping_weight_factor: 0.3,
    typical_margin_min: 0.35,
    typical_margin_max: 0.60,
    demand_sensitivity: 0.10,
    examples: [
      "Shampoo", "Perfume", "Cosmetics",
      "Skincare", "Toothpaste"
    ]
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    duty_bracket: "general",
    shipping_weight_factor: 1.2,
    typical_margin_min: 0.30,
    typical_margin_max: 0.50,
    demand_sensitivity: 0.12,
    examples: [
      "Gym Equipment", "Yoga Mat",
      "Dumbbells", "Sports Watch", "Bicycle"
    ]
  },
  {
    id: "luxury",
    name: "Luxury & Premium Goods",
    duty_bracket: "luxury",
    shipping_weight_factor: 0.2,
    typical_margin_min: 0.60,
    typical_margin_max: 2.00,
    demand_sensitivity: 0.30,
    examples: [
      "Hermès Bag", "Rolex Watch",
      "Louis Vuitton", "Gucci", "Prada"
    ]
  }
];
