const { Client } = require("pg");

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: getSSLValues(),
  });

  try {
    await client.connect();
    const response = await client.query(queryObject);

    return response;
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

export default { query };

function getSSLValues() {
  console.log(process.env.POSTGRES_CA);
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV === "development" ? false : true;
}
