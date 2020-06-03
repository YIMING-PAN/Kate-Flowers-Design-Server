const express = require("express");
const validateId = require("../middleware/validateId");
const authGuard = require("../middleware/authGuard");
const router = express.Router();

const {
  addRoom,
  addUserInRoom,
  removeUser,
  getRoom
} = require("../controllers/rooms");

router.get("/:id", getRoom);
router.post("/", addRoom);
router.post("/:id/users/:userId", validateId, addUserInRoom);
router.delete("/:id/users/:userId", validateId, removeUser);

module.exports = router;
