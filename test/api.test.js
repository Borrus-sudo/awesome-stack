const request = require("supertest");

const app = require("../src/app");

describe("GET /api/v1", () => {
    it("responds with a json message", (done) => {
        request(app)
            .get("/api/v1")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(
                200, {
                    message: "API - 👋🌎🌍🌏",
                },
                done
            );
    });
});

describe("GET /api/v1/cards/json", () => {
    it("responds with a json message", (done) => {
        request(app)
            .get("/api/v1/cards/json?name=Borrus-sudo&repos=jsgandalf")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(
                200, {
                    html: ["html"],
                    css: ["css", "tailwindcss", "css"],
                    javascript: ["javascript", "vue", "typescript"],
                    "testing-frameworks": [],
                    "seo-addons": [],
                    "package-managers": ["npm"],
                    nodejs: ["nodejs"],
                    platforms: [],
                    bundlers: [],
                    tools: ["eslint", "prettier", "babel", "postcss"],
                },
                done
            );

    });
    it("responds with a json message again", (done) => {
        request(app)
            .get("/api/v1/cards/json?name=Borrus-sudo&repos=vue-generator-graph")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, {
                html: ["html", "html"],
                css: ["css"],
                javascript: ["javascript", "typescript"],
                "testing-frameworks": ["mocha"],
                "seo-addons": [],
                "package-managers": ["yarn"],
                nodejs: ["nodejs"],
                platforms: [],
                bundlers: ["webpack"],
                tools: ["eslint"],
            }, done);
    });
    it("should not have react as one of frameworks", (done) => {
        request(app)
            .get("/api/v1/cards/json?name=Informathemusic&repos=informa-db.js")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(
                200, {
                    html: ["html"],
                    css: ["css"],
                    javascript: ["javascript"],
                    "testing-frameworks": [],
                    "seo-addons": [],
                    "package-managers": ["npm"],
                    nodejs: ["nodejs"],
                    platforms: [],
                    bundlers: [],
                    tools: ["eslint"],
                },
                done
            );
    });
    it("responds with not found message", (done) => {
        const username = "JSY";
        const repo = "CrapDaWorld";
        request(app)
            .get(`/api/v1/cards/json?name=${username}&repos=${repo}`)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(
                404, {
                    message: `404: The repo '${repo}' or username '${username}' does not seem to exist`,
                },
                done
            );
    });
});