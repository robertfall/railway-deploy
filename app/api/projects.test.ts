import { describe, expect, it } from "vitest";

import { getAllProjects } from "./projects";
import { clientFactory } from ".";


describe("Projects API", () => {
  it("should return a list of projects", async () => {
    const client = clientFactory(process.env.API_TOKEN!);
    const result = await getAllProjects(client);

    expect(result).toEqual([
      {
        node: {
          id: expect.stringMatching(/^[0-9a-f-]{36}$/),
          name: expect.any(String),
        },
      },
    ]);
  });


});
