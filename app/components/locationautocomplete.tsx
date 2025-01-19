// locationautocomplete.tsx
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { debounce } from "@mui/material/utils";
import { useSearchParams } from "@remix-run/react";
import { Fragment, useEffect, useMemo, useState } from "react";

import {
  LocationPrediction,
  AutocompleteResponse,
  QUERY_PARAMS_ENUM,
} from "~/types/location.types";
import { updateSearchParams } from "~/utils";

export default function LocationAutoComplete() {
  const [selected, setSelected] = useState("");
  const [options, setOptions] = useState<readonly LocationPrediction[]>([]);
  const [query, setQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const fetchData = useMemo(
    () =>
      debounce(
        async (
          request: {
            input: string;
          },
          callback: (result: AutocompleteResponse) => void,
        ) => {
          // TODO: add better error handling
          if (window === undefined || request === null) {
            return;
          }
          const result = await fetch(`api/google/${request.input}`);
          const response = await result.json();

          const { data } = response;

          callback(data);
        },
        100,
      ),
    [],
  );

  useEffect(() => {
    let active = true;

    if (query.replace(/^\s+|\s+$/g, "") === "") {
      setOptions([]);
      return;
    }

    fetchData({ input: query }, (results) => {
      if (active) {
        let newOptions: readonly LocationPrediction[] = [];

        if (results) {
          newOptions = [...newOptions, ...results.predictions];
        }
        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [query, fetchData]);

  useEffect(() => {
    if (searchParams.has(QUERY_PARAMS_ENUM.SELECTED)) {
      setSelected(searchParams.get(QUERY_PARAMS_ENUM.SELECTED) ?? "");
    }
  }, [searchParams, selected, setSearchParams]);

  // TODO: add better error handling
  /**
   * @description a function that handles the location selection
   */
  function handleLocationSelect(): ((value: string) => void) | undefined {
    return (location) => {
      setSelected(location);
      if (location) {
        fetch(`api/geocode/${location}`)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (data?.data) {
              const responseData = data.data.results[0]?.geometry?.location;
              const { lng, lat } = responseData;

              updateSearchParams({
                setSearchParams,
                searchParams,
                newSearchParams: {
                  [QUERY_PARAMS_ENUM.SELECTED]: location,
                  [QUERY_PARAMS_ENUM.LONGITUDE]: lng,
                  [QUERY_PARAMS_ENUM.LATITUDE]: lat,
                },
              });
            }
          });
      }
    };
  }

  return (
    <div className="tw-top-16">
      <Combobox value={selected} onChange={handleLocationSelect()}>
        <div className="tw-relative tw-mt-1 tw-border-1">
          <div className="tw-focus:tw-outline-none tw-focus-visible:tw-ring-2 tw-focus-visible:tw-ring-white/75 tw-focus-visible:tw-ring-offset-2 tw-focus-visible:tw-ring-offset-teal-300 tw-sm:text-sm tw-relative tw-w-full tw-cursor-default tw-overflow-hidden tw-rounded-lg tw-bg-white tw-text-left tw-border tw-border-gray-200">
            <Combobox.Input
              className="tw-outline-none tw-w-full tw-border-none tw-py-4 tw-px-3 tw-text-base tw-leading-5 tw-text-gray-900"
              id="location"
              name="location"
              displayValue={(location: string) => location}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search... e.x 'New York', '123 Main Street', '71111'"
              autoComplete="off"
            />
          </div>
          <Transition
            as={Fragment}
            leave="tw-transition tw-ease-in tw-duration-100"
            leaveFrom="tw-opacity-100"
            leaveTo="tw-opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="tw-focus:tw-outline-none tw-sm:text-sm tw-absolute tw-mt-1 tw-max-h-60 tw-w-full tw-overflow-auto tw-rounded-md tw-bg-white tw-py-1 tw-text-base tw-shadow-lg tw-ring-1 tw-ring-black/5 tw-z-50">
              {options.length === 0 && query !== "" ? (
                <div className="tw-relative tw-cursor-default tw-select-none tw-px-4 tw-py-2 tw-text-gray-700">
                  Nothing found.
                </div>
              ) : (
                options.map((location) => (
                  <Combobox.Option
                    key={location.place_id}
                    className={({ active }) =>
                      `tw-relative tw-cursor-default tw-select-none tw-py-2 tw-pl-10 tw-pr-4 ${
                        active
                          ? "tw-bg-teal-600 tw-text-white"
                          : "tw-text-gray-900"
                      }`
                    }
                    value={location.description}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`tw-block tw-truncate ${
                            selected ? "tw-font-medium" : "tw-font-normal"
                          }`}
                        >
                          {location.description}
                        </span>
                        {selected ? (
                          <span
                            className={`tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3 ${
                              active ? "tw-text-white" : "tw-text-teal-600"
                            }`}
                          >
                            <CheckIcon
                              className="tw-h-5 tw-w-5"
                              aria-hidden="true"
                            />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
