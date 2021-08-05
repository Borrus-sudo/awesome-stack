const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs");

const mostUsedElement = (arr) => {
    const frequencyTable = new Map();
    for (let elem of arr) {
        if (frequencyTable.get(elem)) {
            frequencyTable.set(elem, frequencyTable.get(elem) + 1);
        } else {
            frequencyTable.set(elem, 1);
        }
    }
    return frequencyTable;
};
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
const svgIdentifier = (dependencies, ecosystem) => {
    const contents = flattenDirectory(path.resolve(process.cwd(), "./src/svgs"));
    for (let content of contents) {
        const { name, dir } = path.parse(content);
        dependencies.forEach((dependency) => {
            if (dependency === name || dependency === `@${name}/core`) {
                const { name: folderName } = path.parse(dir);
                if (ecosystem[folderName]) {
                    ecosystem[folderName].push(name);
                }
            }
        });
    }
};
module.exports = async function(metadata) {
    const baseUrl = `https://api.github.com/repos`;
    const repoFile = new Map();
    const ecosystem = {
        html: [],
        css: [],
        javascript: [],
        "testing-frameworks": [],
        "front-end-frameworks": [],
        "css-frameworks": [],
        "seo-addons": [],
        "package-managers": [],
        nodejs: [],
        platforms: [],
        bundlers: [],
        tools: [],
    };
    if (!(metadata.name && metadata.repos)) {
        return {
            message: "404 name and repos parameter is mandatory",
        };
    }
    for (const repo of metadata.repos.split(",").slice(0, 5)) {
        const data = await fetch(baseUrl + `/${metadata.name}/${repo}`).then(
            (res) => res.json()
        );
        const files = [];
        if (data.message === "Not Found") {
            return {
                message: `The repo '${repo}' or username '${metadata.name}' does not seem to exist`,
            };
        }
        const { git_commits_url, default_branch } = data;
        const payload_url = (git_commits_url || "").replace(
            "commits{/sha}",
            `trees/${default_branch}?recursive=1`
        );
        if (payload_url) {
            const payload_data = await fetch(payload_url).then((res) => res.json());
            if (Array.isArray(payload_data.tree))
                files.push(...payload_data.tree.map((elem) => elem.path));
        }
        const repoUrl = `https://raw.githubusercontent.com/${metadata.name}/${repo}/${default_branch}/`;
        repoFile.set(repoUrl, files);
    }
    for (const [key, val] of repoFile) {
        const dependencies = [];
        let pkgCount = 1;
        for (let file of val) {
            const details = path.parse(file);
            if (details.base === "package.json" && pkgCount <= 5) {
                const contents = await fetch(key + file).then((res) => res.json());
                dependencies.push(
                    ...[
                        ...Object.keys(contents.dependencies || {}),
                        ...Object.keys(contents.devDependencies || {}),
                    ]
                );
                pkgCount++;
            } else if (
                ["yarn.lock", "package-lock.json", "pnpm-lock.yaml"].includes(
                    details.base
                )
            ) {
                dependencies.push(
                    details.name === "package-lock" ?
                    "npm" :
                    details.name === "pnpm-lock" ?
                    "pnpm" :
                    details.name
                );
            } else if (
                ["netlify.toml", "vercel.json", "heroku.json", "now.json"].includes(
                    details.base
                )
            ) {
                dependencies.push(details.name === "now" ? "vercel" : details.name);
            } else if (details.name === "Dockerfile") {
                dependencies.push("docker");
            }
            if ([".sass", ".styl", ".scss"].includes(details.ext)) {
                dependencies.push(
                    details.ext === ".scss" ? "sass" : details.ext.slice(1)
                );
            }
        }
        svgIdentifier(Array.from(new Set(dependencies)), ecosystem);
    }
    //Figure out favourites from the ecosystem of tools used in repos
    const favouriteStuff = {};
    Object.keys(ecosystem).forEach((key) => {
        const countMap = mostUsedElement(ecosystem[key]);
        let highest = [];
        let highestCount = 0;
        for (const [val, count] of countMap) {
            if (highestCount < count) {
                highest = [];
                highest.push(val);
                highestCount = count;
            } else if (highestCount === count) {
                highest.push(val);
            }
        }
        favouriteStuff[key] = highest;
    });
    favouriteStuff.html.unshift("html");
    favouriteStuff.css.unshift("css", ...favouriteStuff["css-frameworks"]);
    delete favouriteStuff["css-frameworks"];
    favouriteStuff.javascript.unshift(
        "javascript",
        ...favouriteStuff["front-end-frameworks"]
    );
    delete favouriteStuff["front-end-frameworks"];
    favouriteStuff.nodejs.unshift("nodejs");
    return favouriteStuff;
};