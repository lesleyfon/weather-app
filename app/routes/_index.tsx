import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useMemo } from "react";

import { getGeocode } from "~/api/weather.api";
import { SVG } from "~/components/chartcustomizedcursor";
import DatePickerComponent from "~/components/datepicker";
import LocationAutoComplete from "~/components/locationautocomplete";
import { Button } from "~/components/ui/button";
import { Header } from "~/components/ui/header";
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
    errors.date = "Both dates are required";
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

function FormError({
  errors,
}: {
  errors?: { location?: string; date?: string };
}) {
  if (errors && errors.location && errors.date) {
    return (
      <p className="tw-text-left tw-w-full tw-text-red-700  tw-px-4">
        You are missing both Location and Date. Please Ensure you Include a
        location and a Date
      </p>
    );
  }

  if (errors && errors.date) {
    return (
      <p className="tw-text-left tw-w-full tw-text-red-700 tw-px-4">
        {errors.date}
      </p>
    );
  }
  if (errors && errors.location) {
    return (
      <p className="tw-text-left tw-w-full tw-text-red-700">
        {errors.location}
      </p>
    );
  }
  return null;
}
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
    <>
      <Header
        heading={
          <Link to="/" className="tw-flex tw-items-center tw-gap-2">
            <SVG />
            <span className="tw-text-indigo-900">Weather Compare</span>
          </Link>
        }
      />
      <main className="tw-container tw-flex tw-flex-col tw-mt-7 md:tw-mt-36  tw-m-auto tw-items-center tw-h-screen tw-max-w-6xl tw-w-full">
        <h1 className="tw-text-center tw-text-2xl tw-font-bold tw-text-indigo-900">
          Compare Weather Between Two Dates
        </h1>
        <p className="tw-text-center tw-text-lg tw-text-indigo-900 tw-my-4 ">
          Enter a location and two dates to compare the weather between them.
        </p>
        <Form
          method="post"
          className="tw-grid tw-grid-rows-[repeat(4_1fr)] tw-grid-cols-[repeat(1,100%)]  md:tw-grid-rows-[1] md:tw-grid-cols-[1fr_1fr_1fr_82px] tw-gap-2 tw-justify-center tw-items-center tw-w-full tw-px-4"
        >
          <LocationAutoComplete />

          <DatePickerComponent
            dateType={DateType.FIRST}
            defaultDate={defaultFirstDate}
          />
          <DatePickerComponent
            dateType={DateType.SECOND}
            defaultDate={defaultSecondDate}
          />
          <Button
            type="submit"
            className="tw-bg-indigo-950 tw-text-white tw-h-[52px]"
          >
            Submit
          </Button>
        </Form>
        {actionData?.errors ? <FormError errors={actionData.errors} /> : null}
      </main>
    </>
  );
}

export default Index;
