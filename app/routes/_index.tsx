import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useSearchParams } from "@remix-run/react";
import { format } from "date-fns";
import { useState } from "react";
import { type DayClickEventHandler } from "react-day-picker";

import { getGeocode } from "~/api/weather.api";
import DatePickerComponent from "~/components/datepicker";
import LocationAutoComplete from "~/components/locationautocomplete";
import {
  ENV_TYPES,
  QUERY_PARAMS_ENUM,
  DATE_FORMAT,
} from "~/types/location.types";

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const location = form.get("location") as string;

  const url = new URL(request.url);

  const firstDate = url.searchParams.get(
    QUERY_PARAMS_ENUM.FIRST_DATE,
  ) as string;
  const secondDate = url.searchParams.get(
    QUERY_PARAMS_ENUM.SECOND_DATE,
  ) as string;

  const queryParams = new URLSearchParams();

  // TODO Added better error handling. MAYBE prevent form from submitting
  if (!location) {
    return redirect("/error", { status: 303 });
  }
  if (!firstDate || !secondDate) {
    return redirect("/");
  }
  const response = await getGeocode({
    input: location,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY as ENV_TYPES["GOOGLE_API_KEY"],
  });

  const responseData = response?.results[0]?.geometry?.location;

  if (responseData) {
    const { lng, lat } = responseData;
    queryParams.set("longitude", lng.toString());
    queryParams.set("latitude", lat.toString());

    if (firstDate) queryParams.set(QUERY_PARAMS_ENUM.FIRST_DATE, firstDate);
    if (secondDate) queryParams.set(QUERY_PARAMS_ENUM.SECOND_DATE, secondDate);
  }

  return redirect("/weather-compare?" + queryParams.toString());
};

function Index() {
  const [firstDate, setFirstDate] = useState<Date | undefined>(new Date());
  const [secondDate, setSecondDate] = useState<Date | undefined>(new Date());
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFirstDateSelect: DayClickEventHandler = (date) => {
    setFirstDate(date);
    setSearchParams({
      [QUERY_PARAMS_ENUM.FIRST_DATE]: format(date, DATE_FORMAT),
      [QUERY_PARAMS_ENUM.SECOND_DATE]:
        searchParams.get(QUERY_PARAMS_ENUM.SECOND_DATE) ||
        format(new Date(), DATE_FORMAT),
    });
  };

  const handleSecondDateSelect: DayClickEventHandler = (date) => {
    setSecondDate(date);
    setSearchParams({
      [QUERY_PARAMS_ENUM.FIRST_DATE]:
        searchParams.get(QUERY_PARAMS_ENUM.FIRST_DATE) ||
        format(new Date(), DATE_FORMAT),
      [QUERY_PARAMS_ENUM.SECOND_DATE]: format(date, DATE_FORMAT),
    });
  };

  return (
    <main className="tw-w-1/2 tw-flex tw-justify-center tw-m-auto">
      <Form method="post" className="tw-flex tw-w-full tw-flex-col tw-gap-2">
        <LocationAutoComplete />
        <DatePickerComponent
          date={firstDate}
          handleDaySelect={handleFirstDateSelect}
        />
        <DatePickerComponent
          date={secondDate}
          handleDaySelect={handleSecondDateSelect}
        />
        <button type="submit">Submit</button>
      </Form>
    </main>
  );
}

export default Index;
