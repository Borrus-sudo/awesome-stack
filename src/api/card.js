const express = require("express");
const router = express.Router();
const fetchInfo = require("../utils/fetchInfo");
const createCard = require("../utils/createCard");
router.get("/", async(req, res) => {
    const query = req.query;
    const ctx = await fetchInfo(query);
    const theme = query.theme || "default";
    const svgFile = createCard(ctx, theme);
    res.status(200);
    res.send(svgFile);
});

//For testing purposes
router.get("/json", async(req, res) => {
    const query = req.query;
    const { card } = await fetchInfo(query);
    res.status(200);
    res.json(card);
});

module.exports = router;