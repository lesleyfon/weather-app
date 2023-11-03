export interface AddressComponentType {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface ENV_TYPES {
  GOOGLE_API_KEY: string;
  OPEN_WEATHER_API_KEY: string;
  WEATHER_VISUAL_CROSSING_API_KEY: string;
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

export type LineGraphReturnedData = {
  name: string;
  temp: string;
  tempmax: string;
  tempmin: string;
  precipitation: number;
  humidity: number;
  windspeed: number;
};
export type HourWeatherData = {
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
};

export type WeatherData = {
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
  stations: {
    [stationId: string]: {
      distance: number;
      latitude: number;
      longitude: number;
      useCount: number;
      id: string;
      name: string;
      quality: number;
      contribution: number;
    };
  };
};

export type TooltipPayload = {
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
};
