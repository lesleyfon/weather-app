import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { useMemo } from "react";

import { getGeocode } from "~/api/weather.api";
import DatePickerComponent from "~/components/datepicker";
import LocationAutoComplete from "~/components/locationautocomplete";
import { Button } from "~/components/ui/button";
import { ENV_TYPES, QUERY_PARAMS_ENUM, DateType } from "~/types/location.types";
import { setURLParamsAsDefaultDate } from "~/utils";

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
  const errors: Record<string, string> = {};
  // TODO Added better error handling. MAYBE prevent form from submitting
  if (!location) {
    errors.location = "Location is required";
  }
  if (!firstDate || !secondDate) {
    errors.date = "Date is required";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
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
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();

  const firstDate = searchParams.get(QUERY_PARAMS_ENUM.FIRST_DATE);
  const secondDate = searchParams.get(QUERY_PARAMS_ENUM.SECOND_DATE);

  const { defaultFirstDate, defaultSecondDate } = useMemo(
    () => setURLParamsAsDefaultDate({ firstDate, secondDate }),
    [firstDate, secondDate],
  );
  return (
    <main className="tw-w-1/2 tw-flex tw-justify-center tw-m-auto tw-items-center tw-h-screen">
      <Form
        method="post"
        className="tw-flex tw-flex-col tw-gap-2 tw-justify-center tw-items-center"
      >
        <LocationAutoComplete />
        {actionData?.errors?.location ? (
          <p className="tw-text-red-500">{actionData.errors.location}</p>
        ) : null}
        <div className="tw-flex tw-justify-between tw-w-[500px] tw-gap-2">
          <DatePickerComponent
            dateType={DateType.FIRST}
            defaultDate={defaultFirstDate}
          />
          <DatePickerComponent
            dateType={DateType.SECOND}
            defaultDate={defaultSecondDate}
          />
        </div>
        {actionData?.errors?.date ? (
          <p className="tw-text-red-500">{actionData.errors.date}</p>
        ) : null}
        <Button
          type="submit"
          className="tw-bg-indigo-950 tw-text-white tw-w-[500px]"
        >
          Compare Weather between two dates
        </Button>
      </Form>
    </main>
  );
}

export default Index;
