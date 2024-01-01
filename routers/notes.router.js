import express from "express";
import {
  createNote,
  deleteAll,
  deleteNote,
  getAllNotes,
  updateNote,
  getNote,
} from "../controllers/notes.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create/:userId", verifyUser, createNote);
router.get("/getNote/:id", verifyUser, getNote);
router.get("/getNotes/:userId", verifyUser, getAllNotes);
router.delete("/delete/:id", verifyUser, deleteNote);
router.put("/update/:id", verifyUser, updateNote);

//If the user deactivates his account then remove all Notes created by User
router.delete("/deleteAll/:userId", verifyUser, deleteAll);

export default router;
