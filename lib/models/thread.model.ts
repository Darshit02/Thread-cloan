import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
  text: { type: String, reqired: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    requied: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: String,
  },

  //   Recursive call Threads

  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
});
const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema);

export default Thread;
