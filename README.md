# Quicknotes

This is a work-in-progress chat assistant for (primarily) research papers.

I built this using:
- Fastapi (Python)
- Next/React (Typescript)
- PostgreSQL
- Docker

Along with Llama-Index for RAG.

## Getting Started

### Requirements

- Docker >= 25.0.3
- UV, which you can install [here](https://docs.astral.sh/uv/getting-started/installation/)
- npm >= 11.5.1

### Running

1. Clone this repository: 
2. Generate API keys for:
    - OpenAI
    - Mistral
3. Make a copy of `.env.template`, rename it to `.env`, then fill in each environment variable.
4. In `./backend/`, run `uv sync` to install the required python packages
5. In `./frontend/`, run `npm ci` to install the required TS packages.

To run Dev mode, run the following in the project root:
`bash start_dev.sh`

This will create a tmux window that has panes with:
- postgres docker container
- Next dev server
- Fastapi dev server

## Usage
Once you start the dev server, open:
`http://localhost:3000/auth/create` to create an account \
or \
`http://localhost:3000/auth/login` to login.

These accounts will be hosted on your machine, as I haven't gotten a chance to set up hosting on my VPS.