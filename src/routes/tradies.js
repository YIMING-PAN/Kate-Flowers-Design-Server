const express = require("express");
const validateId = require("../middleware/validateId");
const authGuard = require("../middleware/authGuard");
const router = express.Router();

const {
  addTradie,
  getTradie,
  getAllTradies,
  updateTradie,
  deleteTradie
} = require("../controllers/tradies");

router.post("/", addTradie);
router.get("/:id", validateId, getTradie);
router.get("/", getAllTradies);
router.put("/:id", authGuard, validateId, updateTradie);
router.delete("/:id", authGuard, validateId, deleteTradie);

module.exports = router;
