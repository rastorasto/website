# website

A website I tinkered with — my Next.js playground for trying out ideas,
currently centered on a fake interactive Linux terminal.

## What's in here

- **Fake terminal UI** — commands like `help`, `neofetch`, `meow`, styled to
  look like a real shell session
- **Small backend** — Express + SQLite sidecar that logs clicks and contact
  messages, forwarded to a Discord webhook
- Dev + prod docker-compose setups and a GitHub Actions deploy pipeline

## Stack

Next.js 16 · React 19 · Tailwind 4 · Express · better-sqlite3 · Docker

## Run it

```bash
npm install && npm run dev     # local dev
docker compose up              # full stack
```
