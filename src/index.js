require("dotenv").config();
const express = require("express");
const socketio = require("socket.io");
const htttp = require("http");
require("express-async-errors");
const cors = require("cors");
const { addUser, getUser, removeUser } = require("./controllers/chat");

const routers = require("./routes");
const { connectToDB } = require("./utils/db");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const server = htttp.createServer(app);
const io = socketio(server);

const HOST = "0.0.0.0";
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

io.on("connection", socket => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.emit("message", {
      user: "Byedust admin",
      text: `${user.name}, welcome to room ${user.room}.`
    });
    socket.broadcast.to(user.room).emit("message", {
      user: "Byedust admin",
      text: `${user.name} has joined!`
    });

    socket.join(user.room);

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "Byedust admin",
        text: `${user.name} has left.`
      });
    }
  });
});

app.use("/api", routers);
app.use(errorHandler);

connectToDB()
  .then(() => {
    console.log("DB connected");
    server.listen(PORT, HOST, () => {
      console.log(`Server is listening on PORT: ${PORT}`);
    });
  })
  .catch(e => {
    console.log("DB connection failed");
    console.error(e.message);
    process.exit(1);
  });
