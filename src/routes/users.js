const express = require("express");
const router = express.Router();

const { addUser, checkEmailExist } = require("../controllers/users");
const validateAuth = require("../middleware/validateAuth");

router.post("/check", checkEmailExist);
router.post("/", validateAuth, addUser);

module.exports = router;
