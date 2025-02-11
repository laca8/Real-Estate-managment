const express = require("express");
const {
  createAgent,
  getAgent,
  deleteAgent,
  updateAgent,
} = require("../controllers/agent");
const { protect } = require("../middlwares/auth");
const router = express.Router();
router.post("/", protect, createAgent);
router.get("/:id", protect, getAgent);
router.delete("/:id", protect, deleteAgent);
router.put("/:id", protect, updateAgent);
module.exports = router;
