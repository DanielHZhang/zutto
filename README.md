# Zutto

Zutto is a database editor that provides a modern interface for viewing your data and performing database tasks.

## NOTE: development will continue on the `dev` branch until the SolidHack voting period is over

## Features

Database support

- [x] PostgreSQL
- [ ] MySQL (WIP)
- [ ] SQLite (WIP)

Functionality

- [x] View queried data per table
- [x] Insert new records
- [x] Edit existing records
- [ ] Filter rows/columns

## Developing Locally

Zutto requires the latest version of Rust (1.60 at the time of writing) and a recent version of Node.js (16+).

1. Install Node.js dependencies

```
yarn install
```

2. Install and compile Rust dependencies

```
cd src-tauri
cargo build
```

3. Run frontend development server

```
yarn dev
```

4. OR compile the Tauri application

```
yarn tauri dev
```

## Tech Stack

- Solid.js: frontend UI framework
- Windicss: CSS styling
- Iconoir: icons
- Tauri: backend webview runtime
- SQLx: SQL query executer

## License

MIT or Apache 2.0 (see [LICENSE file](https://github.com/DanielHZhang/zutto/blob/main/LICENSE))
