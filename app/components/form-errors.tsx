export default function FormError({
  errors,
}: {
  errors?: { location?: string; date?: string };
}) {
  if (errors && errors?.location && errors?.date) {
    return (
      <p className="tw-text-left tw-w-full tw-text-red-700  tw-px-4">
        You are missing both Location and Date. Please Ensure you Include a
        location and a Date
      </p>
    );
  }

  if (errors && errors?.date) {
    return (
      <p className="tw-text-left tw-w-full tw-text-red-700 tw-px-4">
        {errors.date}
      </p>
    );
  }
  if (errors && errors?.location) {
    return (
      <p className="tw-text-left tw-w-full tw-text-red-700">
        {errors.location}
      </p>
    );
  }
  return null;
}
