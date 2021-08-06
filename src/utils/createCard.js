const themes = require("./themes");
const path = require("path");
const fs = require("fs");
let svg = "";
module.exports = function({ card, contents }, theme) {
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