const express = require("express");
const router = express.Router();
const fetchInfo = require("../utils/fetchInfo");
const createCard = require("../utils/createCard");
router.get("/", (req, res) => {
    const query = req.query;
    fetchInfo(query);
    createCard();
    res.send("<h1>App Working</h1>");
});

module.exports = router;