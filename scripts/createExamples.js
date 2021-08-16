const ctx = {
    html: ["html"],
    css: ["css", "tailwindcss"],
    javascript: ["javascript", "vue", "typescript"],
    "testing-frameworks": [],
    "seo-addons": [],
    "package-managers": ["npm"],
    nodejs: ["nodejs"],
    platforms: [],
    bundlers: ["webpack"],
    tools: ["eslint", "prettier", "postcss"],
};
const themes = require("../src/utils/themes");
const createCard = require("../src/utils/createCard");
const fs = require("fs");
const path = require("path");
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
let contents = flattenDirectory(path.resolve(process.cwd(), "./src/svgs"));
let doc = `|||| \n |:--:|:--:|:--:| \n`;
let count = 0;
Object.keys(themes).forEach((theme) => {
    count++;
    const content = createCard({ ctx, contents }, theme);

    fs.writeFileSync(`./examples/themes/${theme}.svg`, content);
    if (count === 4) {
        doc += `| \n`;

    }
    doc += `| \`${theme}\`: <br/> ![${theme}](./examples/themes/${theme}.svg) `;
});
fs.writeFileSync("./themes.md", doc);