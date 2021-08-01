const express = require("express");
const router = express.Router();
const fetchInfo = require("../utils/fetchInfo");
const createCard = require("../utils/createCard");
router.get("/", async(req, res) => {
    const query = req.query;
    const resData = await fetchInfo(query);
    createCard();
    res.json(resData);
});

module.exports = router;