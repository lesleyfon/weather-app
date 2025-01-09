import type { ActionFunctionArgs,  LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import  { json } from "@remix-run/node"; // or cloudflare/deno

import { getGeocode } from "~/api/weather.api";
import { ENV_TYPES } from "~/types/location.types";



export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  const location = params.location as string

  const result = await getGeocode({
    input: location,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY as ENV_TYPES["GOOGLE_API_KEY"],
  });

  return json({
    data: result,
    location: params.location,
  });
};


export const action = async ({
  request,
}: ActionFunctionArgs) => {
  switch (request.method) {
    case "GET":
      return json({
        data: "get resource"
      });
    case "POST":

      return json({
        data: "post resource"
      });
  }
};