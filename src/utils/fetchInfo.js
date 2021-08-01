const fetch = require("node-fetch");
const path = require("path");
const getRepos = async(name) => {
    const repos = [];
    const data = await fetch(`https://api.github.com/users/${name}/repos`).then(
        (res) => res.json()
    );
    data.forEach((repo) => {
        repos.push(repo.full_name);
    });
    return repos;
};
module.exports = async function(metadata) {
    const url = `https://api.github.com/repos/${metadata.name}/${metadata.repo}`;
    const files = [];
    const repos = await getRepos(metadata.name);
    const { default_branch, git_commits_url, html_url } = await fetch(url).then(
        (res) => res.json()
    );
    const payload_url = git_commits_url.replace(
        "commits{/sha}",
        `trees/${default_branch}?recursive=1`
    );
    console.log(html_url);
    const payload_data = await fetch(payload_url).then((res) => res.json());
    for (let file of payload_data.tree) {
        files.push(path.parse(file.path).base);
    }
    return { files, repos };
};