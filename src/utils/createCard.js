const themes = require("./themes");
const path = require("path");
const fs = require("fs");

module.exports = function({ ctx: card, contents }, theme) {
    let svg = ``;
    let sectionSpace = 47;
    let animationDelay = 300;
    let imageHeight = 20;
    let imageWidth = -1;
    const offsetSpaceY = 42;
    const offsetIconsX = 47;
    const offsetAnimationDelay = 150;
    const svgHeight = (40 + 15) / 2;
    const spaceStarter = (num) => {
        return num - 14 > 10 ? num * 9 : num * 8.49;
    };
    theme = themes[theme] ? theme : "default";
    Object.keys(card).forEach((key) => {
        //css and html can get repeated cause css-frameworks contains css
        if (
            ["css", "javascript", "nodejs"].indexOf(key) !== -1 &&
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
            <g class="section" style="animation-delay:${animationDelay}ms;" transform="translate(0,${sectionSpace})">
                <text class="text" x="0" y="0">${text}</text> 
                ${localSvg}
            </g>`;
            svg += localSvg;
            sectionSpace += offsetSpaceY;
            //Adding the height
            imageHeight += offsetSpaceY;
            animationDelay += offsetAnimationDelay;
        }
    });
    //Some extra spaces needed for design purposes
    imageWidth += 25;
    imageHeight += 29;
    return `<svg xmlns="http://www.w3.org/2000/svg" class="card" width="${imageWidth}" height="${imageHeight}" viewBox="0 0 ${imageWidth} ${imageHeight}" fill="none">
            <style>
               .title {
                   fill:#${themes[theme].title_color};
                   font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif;
                   font-weight:bold;
                }
                .text {
                    fill:#${themes[theme].text_color};
                    font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif;
                }
                .section {
                    opacity: 0;
                    animation: fadeInAnimation 0.3s ease-in-out forwards;
                }
                @keyframes fadeInAnimation {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
            </style>
            <rect x="1" y="1" rx="4.5" width="99%" height="99%" fill="#${themes[theme].bg_color}" stroke="#e4e2e2" stroke-opacity="1"/>
            <text class="title section" x="81.5" y="30" style="animation-delay:150ms;">My Awesome Stack</text>
            <g transform="translate(20,20)">${svg}</g> 
        </svg>`;
};