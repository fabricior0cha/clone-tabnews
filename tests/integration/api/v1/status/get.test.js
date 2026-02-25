import orchestrator from "tests/orchestrator.js";
beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET /api/v1/status should return status code 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const body = await response.json();
  expect(response.status).toBe(200);
  expect(body.updated_at).toBeDefined();

  const parsedDate = new Date(body.updated_at).toISOString();
  expect(parsedDate).toBe(body.updated_at);

  expect(body.dependencies.database.version).toBeDefined();
  expect(body.dependencies.database.version).toBe("16.0");

  expect(body.dependencies.database.max_connections).toBe(100);
  expect(body.dependencies.database.opened_connections).toBe(1);
});
