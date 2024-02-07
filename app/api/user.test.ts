import { describe, expect, it } from "vitest";

import { getUser } from "./user";
import { clientFactory } from ".";

describe("Users API", () => {
  it("should return a user", async () => {
    const client = clientFactory(process.env.API_TOKEN!);
    const result = await getUser(client);

    expect(result).toEqual([
      {
        id: expect.stringMatching(/^[0-9a-f-]{36}$/),
        name: expect.any(String),
      },
    ]);
  });
});
