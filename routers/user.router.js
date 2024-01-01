import express from "express";
import {
  loginUser,
  registerUser,
  signout,
  profile,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";
import { deleteAll } from "../controllers/notes.controller.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/updateUser/:id", verifyUser, updateUser);
router.get("/profile", verifyUser, profile);
router.delete("/delete/:userId", verifyUser, deleteUser, deleteAll);
router.get("/getUser", getUser);
router.get("/signout", signout);

export default router;
