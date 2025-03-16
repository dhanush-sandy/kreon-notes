import { Notes } from "../models/notes.model.js";

// Get all text notes for a user
export const getTextNotes = async (req, res) => {
  try {
    const { userId, search } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    let query = { userId, type: "text" };

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

    const notes = await Notes.find(query).sort({
      updatedAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: notes,
      message: notes.length
        ? "Text notes retrieved successfully"
        : "No text notes found for this user",
    });
  } catch (error) {
    console.error("Error fetching text notes:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Create a new text note
export const createTextNote = async (req, res) => {
  try {
    let { title, description, userId, color } = req.body;

    // Trim input values
    title = title?.trim();
    description = description?.trim();
    color = color?.trim();

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide title and description",
      });
    }

    const noteData = {
      userId,
      title,
      description,
      color: color || "amber-200",
      type: "text",
    };

    const newNote = new Notes(noteData);
    const savedNote = await newNote.save();

    return res.status(201).json({
      success: true,
      data: savedNote,
      message: "Text note created successfully",
    });
  } catch (error) {
    console.error("Error creating text note:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update an existing text note
export const updateTextNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, description, color } = req.body;

    if (!noteId) {
      return res.status(400).json({
        success: false,
        message: "Note ID is required",
      });
    }

    const updatedNote = await Notes.findOneAndUpdate(
      { _id: noteId, type: "text" },
      { title, description, color },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        success: false,
        message: "Text note not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedNote,
      message: "Text note updated successfully",
    });
  } catch (error) {
    console.error("Error updating text note:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete a text note
export const deleteTextNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    if (!noteId) {
      return res.status(400).json({
        success: false,
        message: "Note ID is required",
      });
    }

    const deletedNote = await Notes.findOneAndDelete({
      _id: noteId,
      type: "text",
    });

    if (!deletedNote) {
      return res.status(404).json({
        success: false,
        message: "Text note not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Text note deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting text note:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
