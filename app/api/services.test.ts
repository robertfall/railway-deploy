import { it, expect, describe, beforeAll } from "vitest";
import { createNewService, deleteService, servicesForProject } from "./services";
import { clientFactory } from ".";

const API_TOKEN = process.env.API_TOKEN;
const TEST_PROJECT_ID = "ad4ddb8e-0480-4bae-9a70-812ea5c1ed00";

describe.skip("Service Queries", () => {
  let client: ReturnType<typeof clientFactory>;

  beforeAll(() => {
    if (!API_TOKEN) {
      throw new Error("API_TOKEN must be provided by env variable");
    }

    client = clientFactory(API_TOKEN);
  });

  it("should create a new service", async () => {
    const randomName = Math.random().toString(36).substring(7);
    const result = await createNewService(
      client,
      TEST_PROJECT_ID,
      `test-service-${randomName}`,
      "nginx:latest",
      {
        PORT: "80",
      }
    );

    expect(result).toEqual({
      id: expect.stringMatching(/^[0-9a-f-]{36}$/),
    });
  });

  it("should be able to fetch all services and delete them", async () => {
    const services = await servicesForProject(client, TEST_PROJECT_ID);

    for (const service of services) {
      await deleteService(client, service.id);
    }
  }, 20000);
});
