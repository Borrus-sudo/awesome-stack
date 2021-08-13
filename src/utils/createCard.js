const themes = require("./themes");
const path = require("path");
const fs = require("fs");

module.exports = function({ ctx: card, contents }, theme) {
    let svg = ``;
    let cy = 20;
    let height = 20;
    let width = -1;
    let offsetY = 85;
    let offsetX = 55;
    console.log(card);
    Object.keys(card).forEach((key) => {
        //css and html can get repeated cause css-frameworks contains css
        const unique = [...new Set(card[key])];
        let localSvg = ``;
        let cx = 0;
        for (let item of unique) {
            //item is svg name
            const elem = contents.find((elem) => path.parse(elem).name === item);
            const svgContent = fs.readFileSync(elem, {
                encoding: "utf-8",
            });
            if (svgContent) {
                localSvg += `<g transform="translate(${cx},0)">${svgContent}</g>`;
                cx += offsetX;
            }
        }
        if (cx > width) {
            width = cx;
        }
        if (localSvg) {
            localSvg = `
            <g class="section" transform="translate(0,${cy})">
                <text y="0" x="0">My favourite ${key}:</text> 
                <g class="icons" transform="translate(0,0)">${localSvg}</g> 
            </g>`;
            svg += localSvg;
            cy += offsetY;
            height += offsetY;
        }
    });
    width += 10;
    width = width < 520 ? 520 : width;
    height += 10;
    console.log("Create card func invoked");
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"> <g transform="translate(20,20)">${svg}</g> </svg>`;
};