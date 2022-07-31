## Development Setup

Quick Start:

```bash
  yarn setup
```

For console output of running containers in a terminal after setup:

```bash
  yarn dev
```

### Hot Reloading

The `restart backend` task defined in `.vscode/tasks.json` restarts the backend container when triggered. The files which trigger the task on save can be configured in `.vscode/settings.json`.

```bash
  .vscode/tasks.json
  {
    "version": "2.0.0",
    "tasks": [
      {
        "label": "restart backend",
        "type": "shell",
        "command": "docker compose restart backend",
        "presentation": {
          "reveal": "never"
        }
      }
    ]
  }

  .vscode/settings.json

  ...
  "triggerTaskOnSave.tasks": {
    "restart backend": ["src/**/*"]
  },

  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true
  },
  ...
```

## Integration Tests Setup

```bash
  yarn docker:up:tests
```

Once the test database container is running...

```bash
  yarn prisma:migrate:tests
```

Tests will auto run in vscode but need to be run sequentially since the database is wiped after each test. The following setting in `.vscode/settings.json` will ensure the tests are run properly. `yarn test` here resolves to `jest -i`.

```bash
  .vscode/settings.json
  {
    ...
    "jest.jestCommandLine": "yarn test"
  }
```

### Migration Workflow

> Note: Backend and dev database containers must be running

Make changes to the schema file, then ...

`yarn prisma:generate`

`yarn docker:migrate:dev name_of_migration`

### Yarn Scripts

`dev`: Starts backend and dev database with console running in the terminal.

`docker:up`: Starts backend and dev database in detached mode, freeing up the terminal.

`docker:down`: Stops and removes the containers running the backend and dev database.

`docker:tests:up`: Starts the datbase container which is used by the integration tests.

`docker:tests:down`: Stops and removes the datbase container which is used by the integration tests.

`docker:migrate:dev`: Runs a prisma migration inside the backend container. Must be passed a name for the migration eg. `yarn docker:migrate:dev name_of_migration`

`docker:migrate:deploy`: Runs prisma migrate deploy inside the backend container.

`docker:rebuild:backend`: Rebuilds and restarts backend only in detached mode.

`lint`: Runs the linter.

`prisma:generate`: Generates asssets based on what is defined in `prisma/schema.prisma`. This command should be run after making changes to the schema.

`prisma:migrate:tests`: Applies migrations to the database used for integration tests.

`setup`: Single command for initial setup. If `prisma/migrations/` is empty, this command will not set the dev database up. If you wish to start without the included initial migration, you will ned to create your own eg. `yarn docker:migrate:dev name_of_migration`

`start:docker`: Builds and enables debugging.

`test`: Runs the integration tests. Container for tests database must be running and migrated first.
