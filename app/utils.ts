import {
  type LineGraphReturnedData,
  type WeatherData,
  type DateParams,
  type DefaultDates,
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

export function convertYYYYMMDDToDate(dateString: string): Date {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  export function setURLParamsAsDefaultDate({ firstDate, secondDate }: DateParams): DefaultDates {
    const defaultDate = new Date();
    
    try {
      const d1 = firstDate === null 
        ? defaultDate 
        : new Date(convertYYYYMMDDToDate(firstDate));
        
      const d2 = secondDate === null 
        ? defaultDate 
        : new Date(convertYYYYMMDDToDate(secondDate));
  
      // Validate that dates are valid
      if (d1.toString() === 'Invalid Date' || d2.toString() === 'Invalid Date') {
        throw new Error(`Invalid date format provided: ${firstDate} or ${secondDate}`);
      }
  
      return { defaultFirstDate: d1, defaultSecondDate: d2 };
    } catch (error) {
      console.error('Error setting default dates:', error);
    return { defaultFirstDate: defaultDate, defaultSecondDate: defaultDate };
  }
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

export interface WeatherTheme {
  primary: string;
  text: string;
}
export enum WeatherCondition {
  SUNNY = "sunny",
  RAINY = "rainy",
  CLOUDY = "cloudy",
  MORNING = "morning",
  AFTERNOON = "afternoon",
  EVENING = "evening",
  NIGHT = "night",
}


export const timeOfDate = (date: Date): WeatherCondition => {
  const hours = date.getHours();
  if (hours < 12) return WeatherCondition.MORNING;
  if (hours < 18) return WeatherCondition.AFTERNOON;
  if (hours < 21) return WeatherCondition.EVENING;
  return WeatherCondition.NIGHT;
};



export const getWeatherTheme = (condition: WeatherCondition): WeatherTheme => {
  const themes: Record<string, WeatherTheme> = {
    sunny: {
      primary: "tw-bg-gradient-to-r tw-from-yellow-400 tw-to-orange-500",
      text: "tw-text-gray-900",
    },
    rainy: {
      primary: "tw-bg-gradient-to-r tw-from-blue-400 tw-to-blue-600",
      text: "tw-text-white",
    },
    cloudy: {
      primary: "tw-bg-gradient-to-r tw-from-gray-300 tw-to-gray-400",
      text: "tw-text-gray-900",
    },
    morning: {
      primary: "tw-bg-gradient-to-r tw-from-yellow-400 tw-to-orange-500",
      text: "tw-text-gray-900",
    },
    afternoon: {
      primary: "tw-bg-gradient-to-r tw-from-yellow-400 tw-to-orange-500",
      text: "tw-text-gray-900",
    },
    evening: {
      primary: "tw-bg-gradient-to-r tw-from-indigo-300 tw-to-indigo-400",
      text: "tw-text-gray-900",
    },
    night: {
      primary: "tw-bg-gradient-to-r tw-from-indigo-300 tw-to-indigo-400",
      text: "tw-text-gray-900",
    },
  };

  return themes[condition] || themes.sunny;
};
