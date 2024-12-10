import { cssBundleHref } from "@remix-run/css-bundle";
import { json, type LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { useEffect } from "react";

import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async () => {
  const ENV_CONFIG = {
    SESSION_SECRET: process.env.SESSION_SECRET,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    WEATHER_VISUAL_CROSSING_API_KEY:
      process.env.WEATHER_VISUAL_CROSSING_API_KEY,
  };

  return json({
    ENV: ENV_CONFIG,
  });
};

export default function App() {
  useEffect(() => {
    if (typeof document === "undefined") return;

    import("react-scan").then(({ scan }) => {
      scan({
        includeChildren: true,
        log: true,
        report: true,
      });
    });
  }, []);

  const { ENV } = useLoaderData<typeof loader>();
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="tw-h-full">
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
