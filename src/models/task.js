const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 50
    },
    status: {
      type: String,
      default: "open" // open/assigned/completed/expired
    },
    location: {
      type: String,
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    budget: {
      type: Number,
      required: true
    },
    details: {
      type: String,
      required: true,
      minlength: 25,
      maxlength: 1000
    },
    offers: [
      {
        tradie: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tradie"
        },
        price: { type: Number },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    comments: {
      type: Array
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    tradie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tradie"
    }
  },
  {
    timestamps: { createdAt: "postDate", updatedAt: "updated" }
  }
);

const model = mongoose.model("Task", schema);

module.exports = model;
