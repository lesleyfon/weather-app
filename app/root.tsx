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
    NODE_ENV: process.env.NODE_ENV,
    POSTHOG_API_KEY: process.env.POSTHOG_API_KEY,
  };

  return json({
    ENV: ENV_CONFIG,
  });
};

export default function App() {
  const { ENV } = useLoaderData<typeof loader>();

  useEffect(() => {
    // Do not scan on production or server side
    if (typeof document === "undefined" || ENV.NODE_ENV === "production")
      return;

    import("react-scan").then(({ scan }) => {
      scan({
        includeChildren: true,
        log: true,
        report: true,
      });
    });
  }, []);

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className={`tw-h-full tw-bg-gradient-to-r tw-from-indigo-300 tw-to-indigo-400`}
      >
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
