const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const fetchInfo = require("../utils/fetchInfo");
const createCard = require("../utils/createCard");
const flattenDirectory = (dir) => {
    const contents = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
    const result = [];
    for (let content of contents) {
        const contentPath = path.join(dir, content);
        if (fs.statSync(contentPath).isFile()) {
            result.push(contentPath);
        } else {
            result.push(...flattenDirectory(contentPath));
        }
    }
    return result;
};
const contents = flattenDirectory(path.resolve(process.cwd(), "./src/svgs"));
router.get("/", async(req, res) => {
    const query = req.query;
    const ctx = await fetchInfo(query, contents);
    if (ctx.message) {
        res.status(404).send(ctx);
        return;
    }
    const theme = query.theme || "default";
    const svgFile = createCard({
            ctx,
            contents,
        },
        theme
    );
    res.setHeader("Content-type", "image/svg+xml");
    res.status(200);
    res.send(svgFile);
});

//For testing purposes
router.get("/json", async(req, res) => {
    const query = req.query;
    const ctx = await fetchInfo(query, contents);
    if (ctx.message) {
        res.status(404).send(ctx);
        return;
    }
    res.status(200);
    res.json(ctx);
});

module.exports = router;