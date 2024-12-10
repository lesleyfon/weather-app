import { TableDataListItemPropType } from "~/types/location.types";

import WeatherConditionSVG from "./WeatherConditionWrapper";

export const ListItem = ({
  liClassNames = "",
  liParagraphClassNames = "tw-py-3 tw-leading-[1.5] tw-text-center tw-text-sm tw-not-italic tw-font-normal tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-1",
  objKey,
  hour,
  liSpanClass,
  tdValue,
  symbol,
}: TableDataListItemPropType) => (
  <li className={`${liClassNames}`}>
    <p className={liParagraphClassNames}>
      {objKey === "conditions" && hour?.conditions ? (
        <WeatherConditionSVG condition={hour?.conditions.toLowerCase()} />
      ) : null}
      <span className={liSpanClass}>
        {tdValue}
        {symbol}
      </span>
    </p>
  </li>
);
