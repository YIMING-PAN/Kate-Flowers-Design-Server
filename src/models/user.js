const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: email =>
        !Joi.string()
          .email()
          .validate(email).error,
      msg: "Invalid email format"
    }
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  role: {
    type: String
  },
  customerRole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer"
  },
  tradieRole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tradie"
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
    }
  ],
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room"
  }
});

/**
 * hashed plain password (from user input)
 * pwd = salt + hashed pwd
 *    ** async function should be added await outside
 */
schema.methods.hashPassword = async function() {
  this.password = await bcrypt.hash(this.password, 10);
};

/**
 * compare user input pwd and datebase pwd
 *    ** async function should be added await outside
 * @param {*} password user input (plain pwd)
 */
schema.methods.validatePassword = async function(password) {
  // this.password means the pwd saved in db
  const isValidatePassword = await bcrypt.compare(password, this.password);

  // valid => true
  return isValidatePassword;
};

const model = mongoose.model("User", schema);

module.exports = model;
