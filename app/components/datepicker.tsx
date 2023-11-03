import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function DatePickerComponent({
  label = "Basic date picker",
  name,
}: {
  name: string;
  label: string;
}) {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={label}
          slotProps={{
            textField: {
              id: name,
              name,
            },
          }}
        />
      </LocalizationProvider>
    </>
  );
}
