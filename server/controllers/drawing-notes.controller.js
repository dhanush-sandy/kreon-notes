import { Drawing } from "../models/drawing.model.js";

// Get all drawing notes for a user
export const getDrawingNotes = async (req, res) => {
  try {
    const { userId, search } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    let query = { userId };

    // Add search functionality
    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }

    const notes = await Drawing.find(query).sort({
      updatedAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: notes,
      message: notes.length
        ? "Drawing notes retrieved successfully"
        : "No drawing notes found for this user",
    });
  } catch (error) {
    console.error("Error fetching drawing notes:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Create a new drawing note
export const createDrawingNote = async (req, res) => {
  try {
    let { title, description, userId, color, drawingData } = req.body;

    // Trim input values
    title = title?.trim();
    description = description?.trim() || "Drawing note";
    color = color?.trim();

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Please provide a title",
      });
    }

    if (!drawingData) {
      return res.status(400).json({
        success: false,
        message: "Drawing data is required",
      });
    }

    const noteData = {
      userId,
      title,
      description,
      color: color || "blue-200",
      type: "drawing",
      drawingData,
    };

    const newNote = new Drawing(noteData);
    const savedNote = await newNote.save();

    return res.status(201).json({
      success: true,
      data: savedNote,
      message: "Drawing note created successfully",
    });
  } catch (error) {
    console.error("Error creating drawing note:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update an existing drawing note
export const updateDrawingNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, description, color, drawingData } = req.body;

    if (!noteId) {
      return res.status(400).json({
        success: false,
        message: "Note ID is required",
      });
    }

    const updateData = {
      title,
      description,
      color,
    };

    if (drawingData) {
      updateData.drawingData = drawingData;
    }

    const updatedNote = await Drawing.findOneAndUpdate(
      { _id: noteId, type: "drawing" },
      updateData,
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        success: false,
        message: "Drawing note not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedNote,
      message: "Drawing note updated successfully",
    });
  } catch (error) {
    console.error("Error updating drawing note:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete a drawing note
export const deleteDrawingNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    if (!noteId) {
      return res.status(400).json({
        success: false,
        message: "Note ID is required",
      });
    }

    const deletedNote = await Drawing.findOneAndDelete({
      _id: noteId,
      type: "drawing",
    });

    if (!deletedNote) {
      return res.status(404).json({
        success: false,
        message: "Drawing note not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Drawing note deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting drawing note:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
