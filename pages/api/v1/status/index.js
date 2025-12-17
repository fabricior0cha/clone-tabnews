import database from "../../../../infra/database.js";

async function status(request, response) {
  const res = await database.query("SELECT 1+1 AS result");
  console.log(res.rows);
  response.status(200).json({ status: "ok" });
}
export default status;
