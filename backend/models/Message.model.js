import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receivers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },
    files: [
      {
        name: { type: String, required: true }, // File name
        url: { type: String, required: true }, // File URL or path
      },
    ],
    text: { type: String, trim: true },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
