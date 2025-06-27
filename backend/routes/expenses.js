const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Expense = require('../models/Expense');
const { checkAuth } = require('../middleware/auth');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/expenses';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Existing route
router.post("", checkAuth, function (req, res, next) {
  // ... existing code ...
});

// New route with image upload support
router.post("/create", checkAuth, upload.array('images', 5), async function (req, res) {
  try {
    const alloweds = [
      "ADMIN",
      "GENERAL MANAGER",
      "MANAGER",
      "SNR ACCOUNTANT",
      "ACCOUNTANT",
      "SECRETARY",
      "OPERATOR"
    ];

    if (!alloweds.includes(req.userData.role)) {
      return res.status(403).json({ message: "Not allowed to create Expense" });
    }

    let expenseObj = req.body;
    expenseObj.creator = req.userData.userId;
    expenseObj.status = "DRAFT";

    // Handle products array from JSON string
    if (typeof expenseObj.products === 'string') {
      expenseObj.products = JSON.parse(expenseObj.products);
    }

    // Add image paths to expense object
    if (req.files && req.files.length > 0) {
      expenseObj.images = req.files.map(file => file.path);
    }

    const expense = new Expense(expenseObj);
    
    // Validate products
    expense.products.forEach((product) => {
      if (!product.name) throw new Error("Product name is required");
    });

    const result = await expense.save();
    
    res.status(201).json({
      message: "Expense added successfully",
      expense: { ...result.toObject(), id: result._id },
    });

  } catch (error) {
    // If there's an error, delete uploaded files
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }

    res.status(500).json({
      message: "Creating an expense failed! " + error.message,
    });
  }
});

module.exports = router; 