const express = require("express");

const router = express.Router();

router.get("/notes");

router.post("/note");

module.exports = router;
