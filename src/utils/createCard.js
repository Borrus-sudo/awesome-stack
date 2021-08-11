const themes = require("./themes");
const path = require("path");
const fs = require("fs");

module.exports = function({ ctx: card, contents }, theme) {
    let svg = "";
    console.log(card);
    Object.keys(card).forEach((key) => {
        //css and html can get repeated cause css-frameworks contains css
        const unique = [...new Set(card[key])];
        for (let item of unique) {
            //item is svg name
            const elem = contents.find((elem) => path.parse(elem).name === item);
            const svgContent = fs.readFileSync(elem, { encoding: "utf-8" });
            svg += `<g>${svgContent}</g> \n`;
        }
    });
    console.log("Create card func invoked");
    return `<svg> ${svg} </svg>`;
};