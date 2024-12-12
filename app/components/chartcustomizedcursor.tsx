import type { TooltipProps } from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

export const SVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={61}
    height={60}
    fill="none"
  >
    <path fill="url(#a)" d="M0 0h60v60H0z" transform="translate(.5)" />
    <defs>
      <pattern
        id="a"
        width={1}
        height={1}
        patternContentUnits="objectBoundingBox"
      >
        <use xlinkHref="#b" transform="scale(.01563)" />
      </pattern>
      <image
        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAAb5JREFUeNrtmtuNgzAQRSmBElwCJbgESuBzy6AESnAJlEAJ/PJHOqAD73g10QJa8sJ4huUiXSlyHMX3jM34lXnvsysrAwAAAAAAAAAAAAAAAAAAAIDfwg8ff/sypIrkSD3Jb6jnOqGuyRI/0QGQCUtqHxh+pvBbezoAbLzbYXytLgWI3QCokTmpiWh8rUYtADbfH2h+/p7IVQGgBhWkKYH5u8bwnyoAcORTmp9DyEUBJOz2m8NBGkAjaD76i/EtAJzqvBJZCQCdIgBdUgDKoh+tF7wDoFUIoE0CgBc2XqnyFAAqYZNhtVjyMLT8OZTVoX3DMBiSI00kz5q4zMQA4KRy/rPZHxksVsbXCt8VewH0QuZzanxQ/Ud0a478I/Pz+mYPAInoFxzh/gWDr8idCYBj83Uk8z+94CMAQhmgZABTRAD+LD0gzDYNj31/gBbZQRuAavZ2PwrAIjtoAlCx8ZI0Hmx+kR00pMFuZt4nltMwEbpHfxQAMGmYCtsEY35T4ouhTPBRsRw+C4Brb4hcfksMm6LYFsfBCI7GcDiK43FckMAVGVySuto1OdwUBQAAAAAAAAAAAAAAAAAA+Pf6Bm5v6/1bJGiwAAAAAElFTkSuQmCC"
        id="b"
        width={64}
        height={64}
      />
    </defs>
  </svg>
);

const CustomizedCursor = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (!active) return null;

  const pl = payload?.[0].payload;
  if (!payload) return null;
  const { windspeed, humidity, precipitation, temp } = pl;

  return (
    <div className="tw-flex tw-flex-row tw-w-[250] tw-bg-white tw-h-[76px] tw-gap-3 tw-shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] tw-p-2">
      <SVG />
      <div className="tw-flex">
        <span className="tw-text-[#202124] tw-text-[47.625px] tw-not-italic tw-font-normal">
          {temp}
        </span>
        <sup className="tw-font-normal tw-text-base tw-leading-[56px]">°F</sup>
      </div>
      <div className="tw-text-[#70757A] tw-text-xs tw-not-italic tw-font-normal tw-leading-4 tw-h-[60px] tw-flex tw-flex-col tw-justify-between ">
        <p>Precipitation: {precipitation}%</p>
        <p>Humidity: {humidity}%</p>
        <p>Wind: {windspeed}mph</p>
      </div>
    </div>
  );
};

export default CustomizedCursor;
