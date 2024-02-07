import { createCookie } from "@remix-run/node";

/* Preferred Color Mode */
export const colorSchemeCookieFactory = createCookie("color-scheme");

export function getColorSchemeToken(request: Request) {
  return colorSchemeCookieFactory.parse(request.headers.get("Cookie"));
}

export async function getColorScheme(request: Request) {
  const userSelectedColorScheme = await getColorSchemeToken(request);
  const systemPreferredColorScheme = request.headers.get(
    "Sec-CH-Prefers-Color-Scheme"
  );
  return userSelectedColorScheme ?? systemPreferredColorScheme ?? "light";
}

/* API Token */
export const apiTokenCookieFactory = createCookie("api-token", {
  httpOnly: true,
});

export function getApiToken(request: Request) {
  return apiTokenCookieFactory.parse(request.headers.get("Cookie"));
}

/* Project ID */
export const projectIdCookieFactory = createCookie("project-id");
export function getProjectIdFromCookie(request: Request) {
  return projectIdCookieFactory
    .parse(request.headers.get("Cookie"))
}
