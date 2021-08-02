const fetch = require("node-fetch");
const path = require("path");
// https://raw.githubusercontent.com/${metadata.name}/${repo}/${default_branch}
const ecosystem = {
    languages: {
        html: [],
        css: [],
        javascript: [],
    },
    frameworks: {
        "front-end-frameworks": [],
        "css-frameworks": [],
        "testing-framework": [],
    },
    platforms: [],
    packageManager: [],
    bundlers: [],
    tools: [],
};
module.exports = async function(metadata) {
    const baseUrl = `https://api.github.com/repos`;
    const repoFile = new Map();
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
                for (let file of payload_data.tree) {
                    files.push(file.path);
                }
        }
        const repoUrl = `https://raw.githubusercontent.com/${metadata.name}/${repo}/${default_branch}/`;
        repoFile.set(repoUrl, files);
    }
    console.log(repoFile);

    for (const [key, val] of repoFile) {
        for (let file of val) {
            const details = path.parse(file);
            console.log(details.base);
            if (details.base === "package.json") {
                const contents = await fetch(key + details.base).then((res) =>
                    res.json()
                );
                console.log({ contents });
                const dependencies = [
                    ...Object.keys(contents.dependencies),
                    ...Object.keys(contents.devDependencies),
                ];
                ecosystem["files"] = dependencies;
                //Main code goes here
            } else if (details.base === "package-lock.json") {
                ecosystem.packageManager.push("npm");
            } else if (details.base === "yarn.lock") {
                ecosystem.packageManager.push("yarn");
            } else if (details.base === "pnpm.lock") {
                ecosystem.packageManager.push("pnpm");
            } else if (details.base === "Dockerfile") {
                ecosystem.tools.push("docker");
            }
        }
    }
    return { ecosystem };
};