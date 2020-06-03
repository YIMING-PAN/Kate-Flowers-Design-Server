const Room = require("../models/room");
const User = require("../models/user");
const { formatResponse } = require("../utils/helper");

const addRoom = async (req, res) => {
  const { name } = req.body;
  const newRoom = new Room({ name });

  await newRoom.save();
  return formatResponse(res, 201, null, newRoom);
};

const addUserInRoom = async (req, res) => {
  const { id, userId } = req.params;

  const existingRoom = await Room.findById(id).populate(
    "users",
    "username room"
  );
  const existingUser = await User.findById(userId);

  // validate exist
  if (!existingRoom) {
    return formatResponse(res, 404, "Room has not found", null);
  }
  if (!existingUser) {
    return formatResponse(res, 404, "User has not found", null);
  }

  // validate redundant
  if (!!existingUser.room) {
    return formatResponse(
      res,
      401,
      "User is already join in the same/other room",
      null
    );
  }

  // add user to room
  const oldCount = existingRoom.users.length;
  existingRoom.users.addToSet(existingUser._id);

  if (oldCount === existingRoom.users.length) {
    return formatResponse(
      res,
      400,
      "Current user can not join in for some reasons",
      null
    );
  }

  // add room to user
  existingUser.room = existingRoom._id;

  if (!existingUser.room.equals(existingRoom._id)) {
    return formatResponse(
      res,
      400,
      "Current user can not join in for some reasons",
      null
    );
  }

  // return success
  await existingRoom.save();
  await existingUser.save();
  return formatResponse(res, 200, null, existingRoom);
};

const removeUser = async (req, res) => {
  const { id, userId } = req.params;

  const existingRoom = await Room.findById(id).populate(
    "users",
    "username room"
  );
  const deletedUser = await User.findById(userId);

  // validate exist
  if (!existingRoom) {
    return formatResponse(res, 404, "Room has not found", null);
  }
  if (!deletedUser) {
    return formatResponse(res, 404, "User has not found", null);
  }

  // check if user in the room
  if (!deletedUser.room || !deletedUser.room.equals(existingRoom._id)) {
    return formatResponse(res, 401, "User is not in the room", null);
  }

  // delete user from room
  await Room.updateOne(
    { _id: deletedUser.room },
    { $pull: { users: deletedUser._id } }
  );

  // delete room from user
  await User.updateOne({ _id: deletedUser._id }, { $unset: { room: "" } });

  return formatResponse(res, 200, null, existingRoom);
};

const getRoom = async (req, res) => {
  const { id } = req.params;
  const existingRoom = await Room.findById(id).populate("users");

  if (!existingRoom) {
    return formatResponse(res, 404, "Room not found", null);
  }

  return formatResponse(res, 200, null, existingRoom);
};

module.exports = {
  addRoom,
  addUserInRoom,
  removeUser,
  getRoom
};
