// routes/problemRoutes.js

const express = require("express");

const {
    getProblem
} = require("../controllers/problemController");

const router = express.Router();

router.get("/:id", getProblem);

module.exports = router;