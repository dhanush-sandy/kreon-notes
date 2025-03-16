import express from "express";
const router = express.Router();
import { deleteNote, updateNote } from "../controllers/common.controller.js";

// Update an existing text note
router.put("/:noteId", updateNote);

// Delete a text note
router.delete("/:noteId", deleteNote);

export default router;
