import { Notes } from "../models/notes.model.js";

export const deleteNote = async (req, res) => {
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

// Update an existing text note
export const updateNote = async (req, res) => {
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
