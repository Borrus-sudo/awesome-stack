const fetch = require("node-fetch");
const fs = require("fs");
//The url from where you can just specify the file name in icons arrays
const url = `https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/`;

const icons = [
    "vue",
    "react",
    "angular",
    "svelte",
    "ember",
    "webpack",
    "rollup",
    "vite",
    "babel",
    "snowpack",
    "npm",
    "yarn",
    "pnpm",
    "tailwindcss",
    "bootstrap",
    "windicss",
    "docker",
    "json",
    "yaml",
    "toml",
    "nuxt",
    "gulp",
    "grunt",
    "netlify",
    "heroku",
    "vercel",
    "javascript",
    "typescript",
    "html",
    "css",
    "nodejs",
    "eslint",
    "prettier",
    "mocha",
    "jest",
    "karma",
    "graphql",
    "i18n",
];
for (let icon of icons) {
    const iconUrl = url + icon + ".svg";
    (async() => {
        //The svgs will be saved in svgs folder in your current working directory and requires you to create `svgs` folder.
        const svgContent = await fetch(iconUrl).then((res) => res.text());
        fs.writeFileSync(`./svgs/${icon}.svg`, svgContent);
    })();
}