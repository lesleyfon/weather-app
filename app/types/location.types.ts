export interface AddressComponentType {
  long_name: string;
  short_name: string;
  types: string[];
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
