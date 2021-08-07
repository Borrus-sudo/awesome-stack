const express = require("express");
const router = express.Router();
const fetchInfo = require("../utils/fetchInfo");
const createCard = require("../utils/createCard");
router.get("/", async(req, res) => {
    const query = req.query;
    const payload = await fetchInfo(query);
    const theme = query.theme || "default";
    const svgFile = createCard(payload, theme);
    res.send(svgFile);
});

module.exports = router;