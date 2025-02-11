const express = require("express");
const {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
} = require("../controllers/property");
const { protect } = require("../middlwares/auth");
const router = express.Router();
router.post("/:agentId", protect, createProperty);
router.get("/", protect, getProperties);
router.get("/:id", protect, getPropertyById);
router.put("/:id/:agentId", protect, updateProperty);
module.exports = router;
