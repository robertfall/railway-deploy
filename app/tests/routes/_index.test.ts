import { describe, it, expect, vi } from "vitest";
import { loader } from "../../routes/_index";
import { apiTokenCookieFactory } from "~/cookies.server";

vi.mock("~/api/services", () => ({
  servicesForProject: async () => {
    return [];
  },
  deleteService: async () => {
    return {};
  },
  createNewService: async () => {
    return {};
  },
}));
vi.mock("~/api/projects", () => ({
  getAllProjects: async () => {
    return [];
  },
}));

describe("loader", () => {
  describe("with no cookie", () => {
    it("redirects to the setup page", async () => {
      const response = (await loader({
        request: new Request("http://localhost/"),
        params: {},
        context: {},
      })) as Response;

      expect(response).toBeInstanceOf(Response);
      expect(response.status).toEqual(302);
      expect(response.headers.get("Location")).toEqual("/setup");
    });
  });

  describe("with cookies", () => {
    it("returns projects", async () => {
      const headers = new Headers();
      headers.append("Cookie", await apiTokenCookieFactory.serialize("test"));
      headers.append("Cookie", "project-id=123");

      const request = new Request("http://localhost/", {
        headers,
      });

      const response = (await loader({
        request: request,
        params: {},
        context: {},
      })) as Response;

      expect(response.status).toEqual(200); // Invalid GraphQL Request due to bad API Token
    });
  });
});
