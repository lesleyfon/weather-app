export const DATE_FORMAT="yyyy-MM-dd"

export enum DateType {
  FIRST = "FIRST",
  SECOND = "SECOND",
}
export enum QUERY_PARAMS_ENUM {
  FIRST_DATE = "first-date",
  SECOND_DATE = "second-date",
  LONGITUDE = "longitude",
  LATITUDE = "latitude",
}
export interface AddressComponentType {
  long_name: string;
  short_name: string;
  types: string[];
}


export interface DateParams {
  firstDate: string | null;
  secondDate: string | null;
}

export interface DefaultDates {
  defaultFirstDate: Date;
  defaultSecondDate: Date;
}

export interface ENV_TYPES {
  GOOGLE_API_KEY: string;
  OPEN_WEATHER_API_KEY: string;
  WEATHER_VISUAL_CROSSING_API_KEY: string;
  POSTHOG_API_KEY: string
}
export interface GeometryBoundsType {
  northeast: {
    lat: number;
    lng: number;
  };
  southwest: {
    lat: number;
    lng: number;
  };
}

export interface GeometryLocationType {
  lat: number;
  lng: number;
}

export interface GeometryViewportType {
  northeast: {
    lat: number;
    lng: number;
  };
  southwest: {
    lat: number;
    lng: number;
  };
}

export interface GeometryType {
  bounds: GeometryBoundsType;
  location: GeometryLocationType;
  location_type: string;
  viewport: GeometryViewportType;
}

export interface ResultType {
  address_components: AddressComponentType[];
  formatted_address: string;
  geometry: GeometryType;
  place_id: string;
  types: string[];
}

export interface ResultsType {
  results: ResultType[];
}

export interface LocationPrediction {
  description: string;
  matched_substrings: {
    length: number;
    offset: number;
  }[];
  place_id: string;
  reference: string;
  structured_formatting: {
    main_text: string;
    main_text_matched_substrings: {
      length: number;
      offset: number;
    }[];
    secondary_text: string;
  };
  terms: {
    offset: number;
    value: string;
  }[];
  types: string[];
}

export interface AutocompleteResponse {
  predictions: LocationPrediction[];
  status: string;
}

export interface LineGraphReturnedData {
  name: string;
  temp: string;
  tempmax: string;
  tempmin: string;
  precipitation: number;
  humidity: number;
  windspeed: number;
}
export interface HourWeatherData {
  datetime: string;
  datetimeEpoch: number;
  temp: number;
  feelslike: number;
  humidity: number;
  dew: number;
  precip: number;
  precipprob: number;
  snow: number;
  snowdepth: number;
  preciptype: string | null;
  windgust: number;
  windspeed: number;
  winddir: number;
  pressure: number;
  visibility: number;
  cloudcover: number;
  solarradiation: number;
  solarenergy: number;
  uvindex: number;
  severerisk: number;
  conditions: string;
  icon: string;
  stations: string[];
  source: string;
}

export interface WeatherData {
  queryCost: number;
  latitude: number;
  longitude: number;
  resolvedAddress: string;
  address: string;
  timezone: string;
  tzoffset: number;
  days: {
    datetime: string;
    datetimeEpoch: number;
    tempmax: number;
    tempmin: number;
    temp: number;
    feelslikemax: number;
    feelslikemin: number;
    feelslike: number;
    dew: number;
    humidity: number;
    precip: number;
    precipprob: number;
    precipcover: number;
    preciptype: string | null;
    snow: number;
    snowdepth: number;
    windgust: number;
    windspeed: number;
    winddir: number;
    pressure: number;
    cloudcover: number;
    visibility: number;
    solarradiation: number;
    solarenergy: number;
    uvindex: number;
    severerisk: number;
    sunrise: string;
    sunriseEpoch: number;
    sunset: string;
    sunsetEpoch: number;
    moonphase: number;
    conditions: string;
    description: string;
    icon: string;
    stations: string[];
    source: string;
    hours: HourWeatherData[];
  }[];
  stations: Record<
    string,
    {
      distance: number;
      latitude: number;
      longitude: number;
      useCount: number;
      id: string;
      name: string;
      quality: number;
      contribution: number;
    }
  >;
}

export interface TooltipPayload {
  stroke: string;
  strokeWidth: number;
  fill: string;
  dataKey: string;
  name: string;
  color: string;
  value: string;
  payload: {
    name: string;
    temp: string;
    tempmax: string;
    tempmin: string;
    precipitation: string;
    humidity: string;
    windspeed: string;
  };
}

export interface WeatherCompareTableProps {
  firstDatetime: string;
  secondDatetime: string;
  weatherDataOne: HourWeatherData[];
  weatherDataTwo: HourWeatherData[];
}

export interface TableRowPropType {
  objKey: string;
  symbol: string;
  weatherDataTwo: HourWeatherData[];
  weatherDataOne: HourWeatherData[];
}

export interface TableDataListItemPropType {
  tdValue: string | number;
  liClassNames: string;
  hour?: HourWeatherData;
  objKey?: string;
  symbol?: string;
  liSpanClass?: string;
  liParagraphClassNames?: string;
}


export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    completion_tokens_details: {
      reasoning_tokens: number;
      accepted_prediction_tokens: number;
      rejected_prediction_tokens: number;
    };
  };
  choices: {
    message: {
      role: string;
      content: string;
    };
    logprobs: null | unknown;
    finish_reason: string;
    index: number;
  }[];
}


export interface ExpandableWeatherRowProps {
  titleList: string[];
  dataKey: keyof HourWeatherData;
  weatherDataTwo: HourWeatherData[];
  weatherDataOne: HourWeatherData[];
}

export interface TableCellContentProps
  extends Pick<ExpandableWeatherRowProps, "titleList" | "dataKey"> {
  Icon: React.ComponentType | null;
  weatherData: HourWeatherData[];
  openCollapsable: boolean;
}