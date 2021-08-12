const fetch = require("node-fetch");
const path = require("path");

const frequencyTableGenerator = (arr) => {
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
const svgIdentifier = (dependencies, ecosystem, contents) => {
    const localEcosystem = {
        html: [],
        css: [],
        javascript: [],
        "testing-frameworks": [],
        "front-end-frameworks": [],
        "css-frameworks": [],
        "seo-addons": [],
        "package-managers": [],
        "javascript-tools": [],
        "css-tools": [],
        nodejs: [],
        platforms: [],
        bundlers: [],
        tools: [],
    };
    for (let content of contents) {
        const { name, dir } = path.parse(content);
        dependencies.forEach((dependency) => {
            if (
                dependency === name ||
                dependency === `@${name}/core` ||
                (dependency.includes(name) &&
                    !dependency.includes(
                        name !== "babel" ? "babel" : "somecrappadsdsds"
                    ) &&
                    !dependency.includes(
                        name !== "eslint" ? "eslint" : "somecrappadsdsds"
                    ))
            ) {
                const { name: folderName } = path.parse(dir);
                if (
                    localEcosystem[folderName] &&
                    !localEcosystem[folderName].includes(name)
                ) {
                    localEcosystem[folderName].push(name);
                }
            }
        });
    }
    //Doing hacky stuff
    if (
        localEcosystem["bundlers"].includes("webpack") &&
        (localEcosystem["seo-addons"].includes("nuxt") ||
            localEcosystem["seo-addons"].includes("next") ||
            localEcosystem["front-end-frameworks"].includes("vue") ||
            localEcosystem["front-end-frameworks"].includes("react"))
    ) {
        localEcosystem["bundlers"].push("webpack");
    }
    Object.keys(localEcosystem).forEach((genre) =>
        ecosystem[genre].push(...localEcosystem[genre])
    );
};
// Constants gonna remain same hence global variables
const svgMapper = new Map([
    ["yarn.lock", "yarn"],
    ["package-lock.json", "npm"],
    ["pnpm-lock.yaml", "pnpm"],
    ["netlify.toml", "netlify"],
    ["vercel.json", "vercel"],
    ["now.json", "vercel"],
    ["Procfile", "heroku"],
    [".sass", "sass"],
    [".scss", "sass"],
    [".styl", "stylus"],
    [".stylus", "stylus"],
    [".less", "less"],
    ["Dockerfile", "docker"],
]);
module.exports = async function(metadata, contents) {
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
        "javascript-tools": [],
        "css-tools": [],
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
                message: `404: The repo '${repo}' or username '${metadata.name}' does not seem to exist`,
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
            } else {
                dependencies.push(
                    svgMapper.get(details.base) ||
                    svgMapper.get(details.name) ||
                    svgMapper.get(details.ext) ||
                    ""
                );
            }
        }
        svgIdentifier([...new Set(dependencies)], ecosystem, contents);
    }
    // Figure out favourites from the ecosystem of tools used in repos
    const card = {};
    Object.keys(ecosystem).forEach((key) => {
        const countMap = frequencyTableGenerator(new Set(ecosystem[key]));
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
        card[key] = highest;
    });
    console.log(card);
    card.html.unshift("html");
    card.css.unshift("css", ...card["css-frameworks"]);
    delete card["css-frameworks"];
    card.javascript.unshift("javascript", ...card["front-end-frameworks"]);
    delete card["front-end-frameworks"];
    card.nodejs.unshift("nodejs");
    card.tools.push(...card["javascript-tools"]);
    delete card["javascript-tools"];
    card.tools.push(...card["css-tools"]);
    delete card["css-tools"];
    return card;
};