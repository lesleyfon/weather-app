/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/docs/en/main/file-conventions/entry.client
 */

import { RemixBrowser } from "@remix-run/react";
import posthog from "posthog-js";
import { startTransition, StrictMode, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";

function PosthogInit() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const API_KEY = window.ENV.POSTHOG_API_KEY as string;
    console.log("API_KEY", API_KEY);
    if (API_KEY) {
      posthog.init(API_KEY, {
        api_host: "https://us.i.posthog.com",
        person_profiles: "always",
      });
    }
  }, []);

  return null;
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
      <PosthogInit />
    </StrictMode>,
  );
});
