const themes = require("./themes");
const path = require("path");
const fs = require("fs");

module.exports = function({ card, contents }, theme) {
    let svg = "";
    console.log(card);
    Object.keys(card).forEach((key) => {
        //css and html can get repeated cause css-frameworks contains css
        const unique = [...new Set(card[key])];
        for (let item of unique) {
            //item is svg name
            const elem = contents.find((elem) => path.parse(elem).name === item);
            const svgContent = fs.readFileSync(elem, { encoding: "utf-8" });
            svg += svgContent + "\n";
        }
    });
    console.log("Create card func invoked");
    return `
    <!DOCTYPE html>
    <html lang="en">

    <head>
       <meta charset="UTF-8">
       <meta http-equiv="X-UA-Compatible" content="IE=edge">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Document</title>
    </head>
    <style>
      svg{
          transform:translate(20px,20px) !important;
      }
    </style>
    <body>
        ${svg}
    </body>

    </html>
    `;
};