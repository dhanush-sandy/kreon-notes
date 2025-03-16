import express from "express";
import {
  getDrawingNotes,
  createDrawingNote,
  updateDrawingNote,
  deleteDrawingNote,
} from "../controllers/drawing-notes.controller.js";

const router = express.Router();

// Get all drawing notes for a user
router.get("/", getDrawingNotes);

// Create a new drawing note
router.post("/", createDrawingNote);

// Update an existing drawing note
router.put("/:noteId", updateDrawingNote);

// Delete a drawing note
router.delete("/:noteId", deleteDrawingNote);

export default router;
