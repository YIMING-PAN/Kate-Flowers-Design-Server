const express = require("express");
const validateId = require("../middleware/validateId");
const authGuard = require("../middleware/authGuard");
const router = express.Router();

const {
  addCustomer,
  getAllCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  assignTradie,
  deleteTradie
} = require("../controllers/customers");

router.post("/", addCustomer);
router.get("/:id", validateId, getCustomer);
router.get("/", getAllCustomers);
router.put("/:id", authGuard, validateId, updateCustomer);
router.delete("/:id", authGuard, validateId, deleteCustomer);
router.post(
  "/:id/tasks/:taskId/tradies/:tradieId",
  authGuard,
  validateId,
  assignTradie
);
router.delete("/:id/tradies/:tradieId", authGuard, validateId, deleteTradie);

module.exports = router;
