import { LoaderArgs } from "@remix-run/node";
import { useState, useEffect } from "react";
import { json, useLoaderData } from "react-router-dom";

export type Station = {
  id: number;
  name: string;
  available_bikes: number;
  available_bikes_percentage: number;
  total_bikes: number;
};

async function fetchStationData(endpoint: string): Promise<Station> {
  const response = await fetch(endpoint);
  const data = await response.json();

  return {
    id: data.records[0].recordid,
    name: data.records[0].fields.name,
    available_bikes: data.records[0].fields.bikes_available,
    available_bikes_percentage: Math.round(
      (data.records[0].fields.bikes_available /
        (data.records[0].fields.bikes_available +
          data.records[0].fields.bikes_in_use)) *
        100
    ),
    total_bikes:
      data.records[0].fields.bikes_available +
      data.records[0].fields.bikes_in_use,
  };
}

export async function loader({}: LoaderArgs) {
  const dampoort = await fetchStationData(
    "https://data.stad.gent/api/records/1.0/search/?dataset=blue-bike-deelfietsen-gent-dampoort"
  );
  const sintpieters = await fetchStationData(
    "https://data.stad.gent/api/records/1.0/search/?dataset=blue-bike-deelfietsen-gent-sint-pieters-m-hendrikaplein"
  );

  return json<Station[]>([dampoort, sintpieters]);
}

export default function Bikes() {
  const stations = useLoaderData() as Station[];
  const [copyStatus, setCopyStatus] = useState("");

  const copyToClipBoard = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopyStatus("copied");
    } catch (err) {
      setCopyStatus("error");
    }
  };

  useEffect(() => {
    if (copyStatus === "copied") {
      const timeoutId = setTimeout(() => {
        setCopyStatus("");
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [copyStatus]);

  return (
    <div className="bg-white py-3 sm:py-4 lg:py-6">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-2 xl:gap-8">
          {stations.map((station: Station) => (
            <div
              key={station.id}
              className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <img
                className="rounded-t-lg object-cover w-full h-40"
                src={
                  station.name === "Station Gent-Dampoort"
                    ? "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Station_Gent-Dampoort_-_Foto_2.JPG/1920px-Station_Gent-Dampoort_-_Foto_2.JPG"
                    : "https://visit.gent.be/sites/default/files/styles/photo_large/public/images-article/Sint-Pietersstation_gent1.jpg?itok=D6l-4mP1"
                }
                alt=""
              />

              <div className="p-5">
                <h5 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {station.name}
                </h5>

                <div className="mb-1 flex justify-between">
                  <div className=" text-lg font-medium dark:text-white">
                    Available Bikes
                  </div>
                  <div className="text-lg font-medium dark:text-white">
                    {station.available_bikes_percentage}%
                  </div>
                </div>

                <div className="mb-5 w-full bg-gray-200 rounded-full dark:bg-gray-700">
                  <div
                    className={`text-sm text-white dark:text-white font-medium text-center py-1 px-2 leading-none rounded-full ${
                      station.available_bikes_percentage <= 33
                        ? "bg-red-600 dark:bg-red-500"
                        : station.available_bikes_percentage <= 66
                        ? "bg-yellow-400 dark:bg-yellow-500"
                        : "bg-green-600 dark:bg-green-500 "
                    }`}
                    style={{
                      width: `${station.available_bikes_percentage}%`,
                    }}
                  >
                    {" "}
                    {station.available_bikes}/{station.total_bikes}
                  </div>
                </div>

                <button
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={() => copyToClipBoard(station.name)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
                    />
                  </svg>
                  &nbsp;Copy Station Name
                </button>
              </div>
            </div>
          ))}
        </div>
        {copyStatus === "copied" ? (
          <div
            id="toast"
            className="fixed bottom-1 right-4 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
            role="alert"
          >
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span className="sr-only">Check icon</span>
            </div>
            <div className="ml-3 text-sm font-normal">Copied to Clipboard</div>
            <button
              type="button"
              className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
              onClick={() => setCopyStatus("")}
              aria-label="Close"
            >
              <span className="sr-only">Close</span>
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
