import { LoaderArgs } from "@remix-run/node";
import { useState } from "react";
import {
  NavLink,
  Outlet,
  json,
  useLoaderData,
  useParams,
  useRouteLoaderData,
} from "react-router-dom";

import styles from "~/styles/parkings.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export type Coordinates = { latitude: number; longitude: number };

export type Parking = {
  id: string;
  name: string;
  description: string;
  category: string;
  total_capacity: number;
  available_capacity: number;
  available_capacity_percentage: number;
  coordinates: Coordinates;
};

export async function loader({}: LoaderArgs) {
  // Currently open (isopennow = 1) checked via API call
  const response = await fetch(
    "https://data.stad.gent/api/records/1.0/search/?dataset=bezetting-parkeergarages-real-time&q=&refine.isopennow=1&rows=15"
  );

  const data = await response.json();

  const parkings: Parking[] = data.records.map((parking: any) => ({
    id: parking.fields.name, // Using `name` as id because `recordid` changes when new records are added to the API -> no stable routing
    name: parking.fields.name,
    description: parking.fields.description,
    category: parking.fields.categorie,
    total_capacity: parking.fields.totalcapacity,
    available_capacity: parking.fields.availablecapacity,
    // Math.min(100, percentage) because percentage sometimes > 100% due to available capacity being more than total capacity
    available_capacity_percentage: Math.min(
      100,
      Math.round(
        (parking.fields.availablecapacity / parking.fields.totalcapacity) * 100
      )
    ),
    coordinates: {
      latitude: parking.geometry.coordinates[1],
      longitude: parking.geometry.coordinates[0],
    },
  }));

  // Sort available_capacity_percentage descending
  const parkingsFiltered = parkings.sort(
    (a, b) => b.available_capacity_percentage - a.available_capacity_percentage
  );

  return json<Parking[]>(parkingsFiltered);
}

export default function Parkings() {
  const parkings = useLoaderData() as Parking[];
  const child = useRouteLoaderData("routes/parkings.$id");
  const { id } = useParams();

  return (
    <div className="bg-white py-3 sm:py-4 lg:py-6">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-4">
        <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-5">
          <div className="sm:w-1/2 order-2 sm:order-1 sm:overflow-y-auto sm:max-h-[calc(100vh-7rem)] grid gap-3 grid-cols-1">
            {parkings.map((parking: Parking) => (
              <NavLink to={`/parkings/${parking.id}`}>
                <div
                  key={parking.id}
                  className={`bg-white rounded-lg shadow dark:bg-gray-800  ${
                    // See styles/parkings.css -> Plain css for border from outside to the inside so content does not move when selected
                    parking.id === id ? "selectedParking" : "notSelectedParking"
                  }`}
                >
                  <div className="p-5">
                    <h5 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {parking.name}
                    </h5>

                    <div className="mb-1 flex justify-between">
                      <div className=" text-lg font-medium dark:text-white">
                        Available Spots
                      </div>
                      <div className="text-lg font-medium dark:text-white">
                        {parking.available_capacity_percentage}%
                      </div>
                    </div>

                    <div className="mb-4 w-full bg-gray-200 rounded-full dark:bg-gray-700">
                      <div
                        className={`text-sm text-white dark:text-white font-medium text-center py-1 px-2 leading-none rounded-full ${
                          parking.available_capacity_percentage <= 33
                            ? "bg-red-600 dark:bg-red-500"
                            : parking.available_capacity_percentage <= 66
                            ? "bg-yellow-400 dark:bg-yellow-500"
                            : "bg-green-600 dark:bg-green-500 "
                        }`}
                        style={{
                          width: `${parking.available_capacity_percentage}%`,
                        }}
                      >
                        {" "}
                        {parking.available_capacity}/{parking.total_capacity}
                      </div>
                    </div>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
          <div className="sm:w-1/2 order-1">
            {id !== undefined ? (
              <Outlet />
            ) : (
              <div className="h-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-3">
                <div className="p-5">
                  <p className="mb-1 font-normal text-gray-800 dark:text-white">
                    Select a Parking to View Details
                  </p>{" "}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
