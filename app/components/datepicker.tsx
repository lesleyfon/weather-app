import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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
