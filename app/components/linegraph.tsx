import { AreaChart, Tooltip, XAxis, YAxis, Label, Area } from "recharts";

import type { WeatherData } from "~/types/location.types";
import CustomizedCursor from "./chartcustomizedcursor";
import { dateStringTo, formatDataToGraph } from "~/utils";

export default function LineGraph({ data }: { data: WeatherData }) {
  // Do something like this: https://www.weather25.com/north-america/usa/texas/lubbock?page=past-weather#day=28&month=10

  return (
    <>
      <section className=" tw-w-full tw-h-full tw-flex tw-justify-center">
        <AreaChart
          width={900}
          height={300}
          data={formatDataToGraph(data)}
          margin={{ top: 5, right: 50, bottom: 10, left: 0 }}
        >
          <XAxis dataKey="name">
            <Label
              value={dateStringTo(data?.days[0].datetime)}
              offset={-7}
              position="insideBottom"
            />
          </XAxis>
          <YAxis
            dataKey="tempmax"
            label={{
              value: "Temparature",
              angle: -90,
              offset: 20,
              position: "insideLeft",
            }}
          />
          <Area
            type="monotone"
            dataKey="temp"
            stroke="#8884d8"
            fill="#e6e9f9"
            activeDot={{ stroke: "yello", r: 5 }}
          />
          <Tooltip content={<CustomizedCursor />} />
        </AreaChart>
      </section>
    </>
  );
}
