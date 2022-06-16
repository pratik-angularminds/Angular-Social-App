const mongoose = require("mongoose");
const reply = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    commentId:{
        type: String,
        required: true,
    },
    replyUserId:{
      type: String,
      required: true,
    },
    reply: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("reply", reply);
