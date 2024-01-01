import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter a Title for the Note"],
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [50, "Title cannot exceed 50 characters"],
    },
    content: {
      type: String,
      required: [true, "Please enter Content for the Note"],
      minlength: [10, "Content must be at least 10 characters long"],
      maxlength: [1000, "Content cannot exceed 1000 characters"],
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", NoteSchema);

export default Note;
