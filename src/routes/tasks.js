const express = require("express");
const validateId = require("../middleware/validateId");
const authGuard = require("../middleware/authGuard");
const router = express.Router();

const {
  addTask,
  getAllTasks,
  getTask,
  addOffer
} = require("../controllers/tasks");

router.get("/", getAllTasks);
router.get("/:id", validateId, getTask);
router.post("/customers/:customerId", authGuard, validateId, addTask);
router.post("/:id/tradies/:tradieId", authGuard, validateId, addOffer);

module.exports = router;
