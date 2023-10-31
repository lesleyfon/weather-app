import { Form } from "@remix-run/react";
import { redirect, type ActionFunctionArgs } from "@remix-run/node";

import DatePickerComponent from "~/components/datepicker";

import { getGeocode } from "~/utils";
import LocationAutoComplete from "~/components/locationautocomplete";

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const location = form.get("location") as string;
  const firstDate = form.get("first-date") as string;
  const secondDate = form.get("second-date") as string;

  if (location === null) {
    return redirect("/error", { status: 303 });
  }
  if (!firstDate && !secondDate) {
    return redirect("/");
  }
  const response = await getGeocode({ input: location });

  const loct = response?.results[0]?.geometry?.location;

  const queryParams = new URLSearchParams();

  if (loct) {
    const { lng, lat } = loct;
    queryParams.set("longitude", lng.toString());
    queryParams.set("latitude", lat.toString());

    if (firstDate) queryParams.set("firstDate", firstDate);
    if (secondDate) queryParams.set("secondDate", secondDate);
  }

  return redirect("/weather-compare?" + queryParams.toString());
};

function Index() {
  return (
    <main className="tw-w-1/2 tw-flex tw-justify-center tw-m-auto">
      <Form method="post" className=" tw-flex tw-w-full tw-flex-col tw-gap-2">
        <LocationAutoComplete />
        <DatePickerComponent name="first-date" label="First Date" />
        <DatePickerComponent name="second-date" label="Second Date" />
        <button type="submit">Submit</button>
      </Form>
    </main>
  );
}

export default Index;
