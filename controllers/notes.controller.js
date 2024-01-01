import Note from "../models/Note.model.js";
import jwt from "jsonwebtoken";
import getTokenData from "../utils/getTokenData.js";

export const createNote = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { title, content } = req.body;

    const newNote = await Note.create({ title, content, userRef: userId });

    return res.status(200).json({
      error: false,
      message: "Note Created Successfully",
      data: newNote,
    });
  } catch (error) {
    return res.status(404).json({
      error: true,
      message: `Note Creation Server Error -> ${error.message}`,
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const noteCheck = await Note.findByIdAndDelete(noteId);
    return res
      .status(200)
      .json({ error: false, message: "Note Deleted Successfully" });
  } catch (error) {
    console.log("Note Deletion Error -> ", error.message);
    return res.status(404).json({
      error: true,
      message: `Note Deletion Server Error -> ${error.message}`,
    });
  }
};

export const deleteAll = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);
    const noteCheck = await Note.deleteMany({ userRef: userId });
    const token = req.cookies.auth_token;
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      const username = data.user.username;

      return res.status(200).json({
        error: false,
        message: `Account and all related Notes Deleted Successfully`,
      });
    });
  } catch (error) {
    console.log("Notes Deletion Error -> ", error.message);
    return res.status(404).json({
      error: true,
      message: `All Notes Deletion Server Error -> ${error.message}`,
    });
  }
};

export const getNote = async (req, res) => {
  try {
    const id = req.params.id;
    const note = await Note.findById(id);
    return res.status(200).json({
      error: false,
      message: "Note Found Successfully",
      data: note,
    });
  } catch (error) {
    console.log("Note Finding Error -> ", error.message);
    return res.status(404).json({
      error: true,
      message: `Note Finding Server Error -> ${error.message}`,
    });
  }
};

export const getAllNotes = async (req, res) => {
  try {
    const userId = req.params.userId;
    const allNotes = await Note.find({ userRef: userId });
    return res.status(200).json({
      error: false,
      message: "All Notes Found Successfully",
      data: allNotes,
    });
  } catch (error) {
    console.log("All Notes Finding Error -> ", error.message);
    return res.status(404).json({
      error: true,
      message: `ALL Notes Finding Server Error -> ${error.message}`,
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    console.log(noteId);
    const checkNote = await Note.findById(noteId);
    if (!checkNote) {
      return res.status(404).json({
        error: true,
        message: "Note not found",
      });
    }

    const { title: newTitle, content: newContent } = req.body;

    const updateFields = {
      title: newTitle,
      content: newContent,
      updatedAt: new Date(),
    };

    const noteCheck = await Note.findByIdAndUpdate(noteId, updateFields, {
      new: true,
    });

    const { _id, title, content, userRef, createdAt, updatedAt } =
      noteCheck._doc;

    const formattedNoteWithReadableDate = {
      _id,
      title,
      content,
      userRef,
      createdAt: createdAt.toLocaleString(),
      updatedAt: updatedAt.toLocaleString(),
    };

    return res.status(200).json({
      error: false,
      message: "Note Updated Successfully",
      data: formattedNoteWithReadableDate,
    });
  } catch (error) {
    console.log("Notes Updating Error -> ", error.message);
    return res.status(404).json({
      error: true,
      message: `Note Updating Server Error -> ${error.message}`,
    });
  }
};
