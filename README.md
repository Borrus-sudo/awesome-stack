# ⚡ awesome-stack
Github Readme Stats for your favourite web dev stack.

<br/>
![Test workflow](https://github.com/Borrus-sudo/awesome-stack/actions/workflows/test.yml/badge.svg)
<br/>

# Why?

Existing github readme stats do not showcase the specific favourite technologies/tools. So here comes my app. It analyzes your repos and figures the the most used tooling and framework and creates a card. Currently only javascript tooling and ecosystem is supported. More coming in the future.

Endpoints:

- /api/v1/card?name=your-github-username&repos=comma,separated,repos

## Important note

CJ is not a contributor. Due to a weird shit mistake or bug (IDK) his name is appearing in the contributor list cause I used his create-express-API boiler plate and messed up in some steps.

## Setup

```
npm install
```

## Lint

```
npm run lint
```

## Test

```
npm run test
```

## Development

```
npm run dev
```

# Support me

Starring this repo shall encourage me to do more open sourcing. So consider starring!

# TO-DO

- Create a card from the svgs
- Look for better caching/storing options for the SVG as analyzing the repo is a bit time consuming.
- Acquiring a GitHub API key
