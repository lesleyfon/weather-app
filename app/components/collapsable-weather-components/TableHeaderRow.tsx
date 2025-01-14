import { memo } from "react";

import { WeatherCompareTableProps } from "~/types/location.types";
import { formatMmDdYyToDateString } from "~/utils";

import { TableRow, TableHead } from "../ui/table";

export const TableHeaderRow = memo(
  ({
    firstDatetime,
    secondDatetime,
  }: Pick<WeatherCompareTableProps, "firstDatetime" | "secondDatetime">) => (
    <TableRow>
      <TableHead className="tw-text-indigo-100 tw-text-2xl tw-font-extrabold">
        <p className="tw-py-3">{formatMmDdYyToDateString(firstDatetime)}</p>
      </TableHead>
      <TableHead className="tw-text-indigo-100 tw-text-2xl tw-font-extrabold">
        <p className="tw-py-3">{formatMmDdYyToDateString(secondDatetime)}</p>
      </TableHead>
    </TableRow>
  ),
);

TableHeaderRow.displayName = "TableHeaderRow";
