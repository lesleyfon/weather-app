"use client";

import { useSearchParams } from "@remix-run/react";
import { useMemo, useCallback } from "react";
import { Area, AreaChart, CartesianGrid, Label, XAxis, YAxis } from "recharts";
import {
  NameType,
  ValueType,
  Payload,
} from "recharts/types/component/DefaultTooltipContent";

import { cn } from "~/lib/utils";
import { QUERY_PARAMS_ENUM, WeatherData } from "~/types/location.types";
import {
  chartConfig,
  formatDataToGraph,
  formatMmDdYyToDateString,
} from "~/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";

export function StackChart({
  conditionOne,
  conditionTwo,
}: {
  conditionOne: WeatherData;
  conditionTwo: WeatherData;
}) {
  const [searchParams] = useSearchParams();

  const firstDate = searchParams.get(QUERY_PARAMS_ENUM.FIRST_DATE);
  const secondDate = searchParams.get(QUERY_PARAMS_ENUM.SECOND_DATE);

  const config: ChartConfig = useMemo(
    () => chartConfig(firstDate, secondDate),
    [firstDate, secondDate],
  );

  const formatData = useMemo(() => {
    const d1 = formatDataToGraph(conditionOne);
    const d2 = formatDataToGraph(conditionTwo);
    let tempmax = 0;

    // Convert d2 into a Map for O(1) lookups
    const d2Map = new Map(
      d2.map((item) => {
        tempmax = Math.max(tempmax, Number(item.temp));
        return [item.name, item.temp];
      }),
    );

    return d1.map(({ name, temp }) => {
      const timeOfDay = name.split(" ").join(":00 ");
      tempmax = Math.max(tempmax, Number(temp));
      return {
        firstDate,
        secondDate,
        timeOfDay,
        conditionOne: temp,
        tempmax: tempmax + 10,
        conditionTwo: d2Map.get(name),
      };
    });
  }, [conditionOne, conditionTwo, firstDate, secondDate]);

  const formattedDate = useCallback(formatMmDdYyToDateString, []);

  return (
    <Card className="tw-h-[500px]">
      <CardHeader>
        <CardTitle>
          Area Chart - Compare temperature between{" "}
          <span className="tw-text-indigo-400 tw-underline">
            {formattedDate(firstDate)}
          </span>{" "}
          and{" "}
          <span className="tw-text-indigo-400 tw-underline">
            {formattedDate(secondDate)}
          </span>
        </CardTitle>
        <CardDescription>Showing temperature between two dates</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <AreaChart
            accessibilityLayer
            data={formatData}
            margin={{ top: 5, right: 50, bottom: 10, left: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              className="tw-pb-4"
              dataKey="timeOfDay"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 5)}
            >
              <Label value="Time of Day" offset={-7} position="insideBottom" />
            </XAxis>
            <YAxis
              dataKey="tempmax"
              domain={[0, "dataMax + 10"]}
              allowDataOverflow={true}
              label={{
                value: "Temparature",
                angle: -90,
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  label="timeOfDay"
                  formatter={(
                    value: ValueType,
                    name: NameType,
                    item: Payload<ValueType, NameType>,
                    index: number,
                    payload: Payload<ValueType, NameType> & {
                      firstDate?: string;
                      secondDate?: string;
                    },
                  ) => {
                    const { firstDate, secondDate } = payload;
                    return (
                      <div className="tw-flex tw-flex-col tw-gap-2">
                        <div className="tw-flex tw-items-center tw-gap-2">
                          <div
                            className={cn(
                              "tw-h-2 tw-w-2 tw-rounded-[2px]",
                              index === 0 ? "tw-bg-red-500" : "tw-bg-green-500",
                            )}
                          />
                          <p className="tw-text-[10px]">
                            <span className="tw-text-gray-500 tw-dark:tw-text-gray-400">
                              {index === 0 ? firstDate : secondDate}
                            </span>{" "}
                            <span>{value}&#176;F</span>
                          </p>
                        </div>
                      </div>
                    );
                  }}
                />
              }
            />
            <Area
              dataKey="conditionOne"
              type="natural"
              fill="red"
              fillOpacity={0.4}
              stroke="red"
            />
            <Area
              dataKey="conditionTwo"
              type="natural"
              fill="green"
              fillOpacity={0.4}
              stroke="green"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
