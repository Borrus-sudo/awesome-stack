const themes = require("./themes");
const path = require("path");
const fs = require("fs");

module.exports = function({ ctx: card, contents }, theme) {
    let svg = ``;
    let sectionSpace = 20;
    let imageHeight = 20;
    let imageWidth = -1;
    let offsetSpaceY = 42;
    let offsetIconsX = 42;
    const svgHeight = (40 + 15) / 2;
    const spaceStarter = (num) => {
        return num - 14 > 10 ? num * 9 : num * 8.49;
    };
    console.log(card);
    Object.keys(card).forEach((key) => {
        //css and html can get repeated cause css-frameworks contains css
        if (
            ["html", "css", "javascript", "nodejs"].indexOf(key) !== -1 &&
            card[key].length === 1
        ) {
            return;
        }
        const unique = [...new Set(card[key])];
        let localSvg = ``;
        const text = `My favourite ${key}:`;
        let iconsX = 0 + spaceStarter(text.length);
        for (let item of unique) {
            //item is svg name
            const elem = contents.find((elem) => path.parse(elem).name === item);
            const svgContent = fs.readFileSync(elem, {
                encoding: "utf-8",
            });
            if (svgContent) {
                localSvg += `<g transform="translate(${iconsX},-${svgHeight})">${svgContent}</g>`;
                iconsX += offsetIconsX;
            }
        }
        if (iconsX > imageWidth) {
            //Size equal to the longest width
            imageWidth = iconsX;
        }
        if (localSvg) {
            localSvg = `
            <g class="section" transform="translate(0,${sectionSpace})">
                <text x="0" y="0">${text}</text> 
                ${localSvg}
            </g>`;
            svg += localSvg;
            sectionSpace += offsetSpaceY;
            //Adding the height
            imageHeight += offsetSpaceY;
        }
    });
    imageWidth += 10;
    imageWidth = imageWidth < 520 ? 520 : imageWidth;
    imageHeight += 10;
    console.log("Create card func invoked");
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${imageWidth}" height="${imageHeight}" viewBox="0 0 ${imageWidth} ${imageHeight}"> <g transform="translate(20,20)">${svg}</g> </svg>`;
};