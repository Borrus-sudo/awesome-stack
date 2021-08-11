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
const contents = flattenDirectory(path.resolve(process.cwd(), "./src/svgs"));
for (let content of contents) {
    const svg = fs.readFileSync(content, { encoding: "utf-8" });
    fs.writeFileSync(content, svg.replace(/\s+/g, " "));
}