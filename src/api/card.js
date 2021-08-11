const express = require("express");
const router = express.Router();
const fetchInfo = require("../utils/fetchInfo");
const createCard = require("../utils/createCard");
router.get("/", async(req, res) => {
    const query = req.query;
    const ctx = await fetchInfo(query);
    if ((ctx.message || "").startsWith("404")) {
        res.status(404).send(ctx);
        return;
    };
    const theme = query.theme || "default";
    const svgFile = createCard(ctx, theme);
    res.status(200);
    res.send(svgFile);
});

//For testing purposes
router.get("/json", async(req, res) => {
    const query = req.query;
    const ctx = await fetchInfo(query);
    if ((ctx.message || "").startsWith("404")) {
        res.status(404).send(ctx);
        return;
    }
    res.status(200);
    res.json(ctx.card);
});

module.exports = router;