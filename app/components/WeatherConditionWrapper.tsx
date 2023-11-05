import {
  WeatherClearSVG,
  WeatherCloudySVG,
  WeatherRainSVG,
  WeatherSunnySVG,
  WeatherSnowSVG,
} from "~/assets/svg/";

const WeatherConditionSVG = ({ condition }: { condition: string }) => {
  console.log(condition);
  if (condition.includes("rain")) {
    return <WeatherRainSVG />;
  }

  if (condition.includes("cloud")) {
    return <WeatherCloudySVG />;
  }

  if (condition.includes("clear")) {
    return <WeatherClearSVG />;
  }

  if (condition.includes("snow")) {
    return <WeatherSnowSVG />;
  }

  return <WeatherSunnySVG />;
};

export default WeatherConditionSVG;
