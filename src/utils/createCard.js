const themes = require("./themes");
const path = require("path");
const fs = require("fs");
let svg = "";
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
module.exports = function(card, theme) {
    Object.keys(card).forEach((key) => {
        for (let item of card[key]) {
            //item is svg name
            const elem = contents.find((elem) => path.parse(elem).name === item);
            const svgContent = fs.readFileSync(elem, { encoding: "utf-8" });
            svg += svgContent + "\n";
        }
    });
    console.log("Create card func invoked");
    return svg;
};