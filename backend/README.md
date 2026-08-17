# backend

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run start
```

## Database

The Sequelize models are the source of truth for the database schema. To drop
all application tables and recreate them from the models:

```bash
bun run db:reset
```

Seed data is kept separate and can be added afterwards:

```bash
bun run db:seed
```

Run both steps together with:

```bash
bun run db:setup
```

`db:reset` deletes all existing data and is disabled when
`NODE_ENV=production`. The legacy SQL schema file is not used by this setup.

This project was created using `bun init` in bun v1.3.8. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
