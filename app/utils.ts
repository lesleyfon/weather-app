import {
  type LineGraphReturnedData,
  type WeatherData,
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

export function formatMmDdYyToDateString(date:string| null){
  if (!date) return "";
    return Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
}

export function chartConfig(firstDate:string|null, secondDate:string|null){
  return {
    conditionOne: {
      label: firstDate,
      color: "hsl(var(--chart-2))",
    },
    conditionTwo: {
      label: secondDate,
      color: "hsl(var(--chart-1))",
    },
  };
}
export const celsiusToFahrenheit = (temp: number) => {
  const t = ((temp * 9) / 5 + 32).toFixed(2);
  return t;
};

export const formatDataToGraph = (data: WeatherData) => {
  if (!data?.days[0]) return [];

  const tempmin = data?.days?.[0]?.tempmin || 0;
  const hours = data?.days?.[0]?.hours || [];
  const tempmax = data?.days?.[0]?.tempmax || 0;

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

export const hourDataKeysToFullWord = {
  temp: ["Temperature", "°F"],
  feelslike: ["Feels Like", "°F"],
  conditions: ["Conditions", ""],
  precip: ["Precipitation", " in"],
  snow: ["Chance Of Snow", "%"],
  humidity: ["Humidity", "%"],
  windspeed: ["Wind Speed", " mph"],
  windgust: ["Wind Gust", " Miles"],
  cloudcover: ["Cloud Cover", "%"],
  visibility: ["Visibility", " Miles"],
};


export const shouldDisableDate = (date: Date) =>
  date > new Date() || date < new Date("1900-01-01");
