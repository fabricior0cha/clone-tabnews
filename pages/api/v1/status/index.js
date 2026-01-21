import database from "../../../../infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const dbName = process.env.POSTGRES_DB;

  const dbVersionResult = await database.query("SHOW server_version;");
  const dbVersion = dbVersionResult.rows[0].server_version;

  const maxConnectionsResult = await database.query("SHOW max_connections;");
  const maxConnections = maxConnectionsResult.rows[0].max_connections;

  const openedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [dbName],
  });

  const openedConnections = openedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dbVersion,
        max_connections: parseInt(maxConnections),
        opened_connections: openedConnections,
      },
    },
  });
}
export default status;
