const express = require("express");
const router = express.Router();
const customerRoute = require("./routes/customers");
const tradieRoute = require("./routes/tradies");
const userRoute = require("./routes/users");
const taskRoute = require("./routes/tasks");
const roomRoute = require("./routes/rooms");
const authRoute = require("./routes/auth");

router.use("/customers", customerRoute);
router.use("/tradies", tradieRoute);
router.use("/tasks", taskRoute);
router.use("/users", userRoute);
router.use("/rooms", roomRoute);
router.use("/auth", authRoute);

module.exports = router;
