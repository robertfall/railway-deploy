import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";

import "./tailwind.css";
import { getColorScheme } from "./cookies.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const theme = await getColorScheme(request);

  return { theme };
}

export default function App() {
  const { theme } = useLoaderData<typeof loader>();
  return (
    <html
      lang="en"
      className="dark"
      style={{
        colorScheme: theme,
      }}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
