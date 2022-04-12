# Zutto

Zutto is a database editor that provides a modern interface for viewing your data and performing database tasks.

<img width="1282" alt="image" src="https://user-images.githubusercontent.com/30360288/162862447-bbce11dc-bb04-4523-91a8-f316df48f66f.png">

## NOTE: development will continue on the `dev` branch until the SolidHack voting period is over

## Roadmap

Database support

- [x] PostgreSQL
- [ ] MySQL (WIP)
- [ ] SQLite (WIP)

Functionality

- [x] View queried data per table
- [x] Insert new records
- [x] Edit existing records
- [ ] Filter rows/columns

## Development

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

3. Run the application locally

```
yarn tauri dev
```

OR run the development server only for the frontend

```
yarn dev
```

4. Compile for production

```
yarn tauri build
```

## Tech Stack

- Solid.js: frontend UI framework
- Windicss: CSS styling
- Iconoir: icons
- Tauri: backend webview runtime
- SQLx: SQL query executer

## License

MIT or Apache 2.0 (see [LICENSE file](https://github.com/DanielHZhang/zutto/blob/main/LICENSE))
