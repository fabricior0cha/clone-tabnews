import database from "infra/database";
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(request, response) {
  const client = await database.getClient();

  const defaultOptions = {
    dbClient: client,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method == "GET") {
    const pendingMigrations = await migrationRunner(defaultOptions);
    await client.end();
    return response.status(200).json(pendingMigrations);
  }

  if (request.method == "POST") {
    const migratedMigrations = await migrationRunner({
      ...defaultOptions,
      dryRun: false,
    });

    await client.end();

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  }

  return response.status(405).end();
}
