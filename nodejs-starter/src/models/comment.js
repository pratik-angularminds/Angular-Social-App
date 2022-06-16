const mongoose = require("mongoose");
const comments = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    reply: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("comment", comments);
