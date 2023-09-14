## Running the app

```bash
# Local
$ make up

# production mode
$ npm run start:prod
```

## Migrations

```bash
# Create a migration
$ npm run migration:create --name=foo

# Generate a migration from schema changes
$ npm run migration:generate --name=bar

# Run migrations and checks for schema changes
$ npm run migration:run

# Revert migrations
$ npm run migration:revert
```
