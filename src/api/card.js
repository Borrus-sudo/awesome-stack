const express = require("express");
const router = express.Router();
const fetchInfo = require("../utils/fetchInfo");
const createCard = require("../utils/createCard");
router.get("/", async(req, res) => {
    const query = req.query;
    const ctx = await fetchInfo(query);
    const theme = query.theme || "default";
    const svgFile = createCard(ctx, theme);
    res.send(svgFile);
});

module.exports = router;