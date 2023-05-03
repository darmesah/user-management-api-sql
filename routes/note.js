const express = require("express");

const isAuth = require("../middleware/is-auth");
const noteController = require("../controllers/note");

const router = express.Router();

router.get("/notes", isAuth, noteController.getNotes);

router.get("/note/:id", isAuth, noteController.getNote);

router.post("/note", isAuth, noteController.addNote);

router.patch("/note/:id", isAuth, noteController.editNote);

router.delete("/note/:id", isAuth, noteController.deleteNote);

module.exports = router;
