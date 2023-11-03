import dayjs from "dayjs";
import type {
  ENV_TYPES,
  AutocompleteResponse,
  ResultsType,
} from "~/types/location.types";

const requestOptions: RequestInit = {
  method: "GET",
  redirect: "follow",
  mode: "cors",
  referrerPolicy: "strict-origin-when-cross-origin",
  headers: {
    accept: "*/*",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
  },
};

export async function getAutocompletePrediction({
  input,
  GOOGLE_API_KEY,
}: {
  input: string;
  GOOGLE_API_KEY: ENV_TYPES["GOOGLE_API_KEY"];
}): Promise<AutocompleteResponse | null> {
  try {
    const encodedInput = encodeURI(input);

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodedInput}&key=${GOOGLE_API_KEY}`,
      requestOptions,
    );
    const data: AutocompleteResponse = await response.json();

    return data;
  } catch (error) {
    console.log("error", error);
    return null;
  }
}

export async function getGeocode({
  input,
  GOOGLE_API_KEY,
}: {
  input: string;
  GOOGLE_API_KEY: ENV_TYPES["GOOGLE_API_KEY"];
}) {
  try {
    const encodedInput = encodeURI(input);

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedInput}&key=${GOOGLE_API_KEY}`,
      requestOptions,
    );

    const data: ResultsType = await response.json();

    return data;
  } catch (error) {}
}

export async function getWeatherLocation({
  longitude,
  latitude,
  date,
  WEATHER_VISUAL_CROSSING_API_KEY,
}: {
  longitude: string;
  latitude: string;
  date: string;
  WEATHER_VISUAL_CROSSING_API_KEY: ENV_TYPES["WEATHER_VISUAL_CROSSING_API_KEY"];
}) {
  try {
    const requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow",
    };
    const formattedDate = dayjs(date).format("YYYY-MM-DD");

    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}/${formattedDate}?unitGroup=metric&key=${WEATHER_VISUAL_CROSSING_API_KEY}`,
      requestOptions,
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.log("error", error);
  }
}
