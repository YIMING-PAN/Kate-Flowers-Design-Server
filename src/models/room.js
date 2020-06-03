const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

const model = mongoose.model("Room", schema);

module.exports = model;
