import type {
  LineGraphReturnedData,
  WeatherData,
} from "./types/location.types";

export const militaryTimeToStandardTime = (time: string) => {
  const [hours] = time.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;

  const standardTime = hour + " " + ampm;
  return standardTime;
};

export const dateStringTo = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const celsiusToFahrenheit = (temp: number) => {
  const t = ((temp * 9) / 5 + 32).toFixed(2);
  return t;
};

export const formatDataToGraph = (data: WeatherData) => {
  if (!data?.days[0]) return [];
  const { hours, tempmax, tempmin } = data?.days[0];

  const d = hours.map((hour): LineGraphReturnedData => {
    const { temp, datetime, windspeed, precip, humidity } = hour;
    const time = militaryTimeToStandardTime(datetime.slice(0, -3));

    return {
      name: time,
      temp: celsiusToFahrenheit(temp),
      tempmax: celsiusToFahrenheit(tempmax),
      tempmin: celsiusToFahrenheit(tempmin),
      precipitation: precip,
      humidity,
      windspeed,
    };
  });

  return d;
};
