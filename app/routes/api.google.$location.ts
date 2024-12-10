import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import  { json } from "@remix-run/node"; // or cloudflare/deno

import { getAutocompletePrediction } from "~/api/weather.api";


// Add this loader for GET requests
export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  const location = params.location as string

  const result = await getAutocompletePrediction({
    input: location,
    GOOGLE_API_KEY: process.env?.["GOOGLE_API_KEY"] ?? ""
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