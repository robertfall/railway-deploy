import { describe, expect, it } from "vitest";

import { createNewService, deleteService, getAllProjects, servicesForProject } from "./projects";

const TEST_PROJECT_ID = "ad4ddb8e-0480-4bae-9a70-812ea5c1ed00";
describe("Projects API", () => {
  it("should return a list of projects", async () => {
    const result = await getAllProjects();

    expect(result).toEqual([
      {
        node: {
          id: expect.stringMatching(/^[0-9a-f-]{36}$/),
          name: expect.any(String),
        },
      },
    ]);
  });

  it("should create a new service", async () => {
    const randomName = Math.random().toString(36).substring(7);
    const result = await createNewService(
      TEST_PROJECT_ID,
      `test-service-${randomName}`,
      "nginx:latest",
      {
        "PORT": "80",
      }
    );

    expect(result).toEqual({
      id: expect.stringMatching(/^[0-9a-f-]{36}$/),
    });
  });

  it.only("should be able to fetch all services and delete them", async () => {
    const services = await servicesForProject(TEST_PROJECT_ID);

    for (const service of services) {
      await deleteService(service.node.id);
    }
  }, 20000);
});
