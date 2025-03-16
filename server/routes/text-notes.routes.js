import express from "express";
import {
  getTextNotes,
  createTextNote,
  updateTextNote,
  deleteTextNote,
} from "../controllers/text-notes.controller.js";

const router = express.Router();

// Get all text notes for a user
router.get("/", getTextNotes);

// Create a new text note
router.post("/", createTextNote);

// Update an existing text note
router.put("/:noteId", updateTextNote);

// Delete a text note
router.delete("/:noteId", deleteTextNote);

export default router;
