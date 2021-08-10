const fs = require("fs");
const path = require("path");
const string = `width="24" height="24"`;

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
for (let content of contents) {
    const svg = fs.readFileSync(content, { encoding: "utf-8" });
    const newStuff = svg
        .replace(/width="(.*?)"/, ` width="57" `)
        .replace(/height="(.*?)"/, ` height="57" `);
    if (!svg.match(/width="(.*?)"|height="(.*?)"/)) {
        console.log(content);
    }
    fs.writeFileSync(content, newStuff);
}