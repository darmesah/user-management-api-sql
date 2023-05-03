const Note = require("../models/note");

exports.getNotes = async (req, res, next) => {
  try {
    const notes = await req.user.getNotes();

    if (!notes || notes.length === 0) {
      const error = new Error("No notes available");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: "Notes fetched successfully", notes });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getNote = async (req, res, next) => {
  const id = req.params.id;

  try {
    const notes = await req.user.getNotes({ where: { id } });

    if (!notes || notes.length === 0) {
      const error = new Error("Note not found");
      error.statusCode = 404;
      throw error;
    }

    res
      .status(200)
      .json({ message: "Note fetched successfully", note: notes[0] });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.addNote = async (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;

  try {
    await req.user.createNote({
      title,
      description,
    });

    res.status(200).json({ message: "Note created successfully" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.editNote = async (req, res, next) => {
  const id = req.params.id;

  const title = req.body.title;
  const description = req.body.description;

  try {
    const notes = await req.user.getNotes({ where: { id } });

    if (notes.length === 0) {
      const error = new Error("Note not found");
      error.statusCode = 404;
      throw error;
    }

    const note = notes[0];

    note.title = title;
    note.description = description;

    const updatedNote = await note.save();

    res
      .status(200)
      .json({ message: "Note updtated successfully", updatedNote });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  const id = req.params.id;

  try {
    const notes = await req.user.getNotes({ where: { id } });

    if (notes.length === 0) {
      const error = new Error("Note not found");
      error.statusCode = 404;
      throw error;
    }

    const note = notes[0];

    await note.destroy();

    res.status(200).json({ message: "Note Deleted successfully" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
