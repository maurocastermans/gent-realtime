import { NavLink, useParams, useRouteLoaderData } from "react-router-dom";

import { Parking } from "./parkings";

export default function ParkingId() {
  // Get loader data from parent route -> no need to request from API again
  const parkings = useRouteLoaderData("routes/parkings") as Parking[];
  const { id } = useParams();
  const parkingWithDetails = parkings.find((parking) => id === parking.id);

  // Handle case where parking with given id was not found
  if (!parkingWithDetails) {
    return (
      <div className="h-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-6">
        <div className="p-5">
          <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">
            Parking Not Found
          </p>{" "}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4 sm:mb-0">
      <div className="p-5 ">
        <h5 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {parkingWithDetails.description}
        </h5>
        <div className="mb-1 flex justify-between">
          <div className="text-lg font-medium dark:text-white">
            Available Spots
          </div>
          <div className="text-lg font-medium dark:text-white">
            {parkingWithDetails.available_capacity_percentage}%
          </div>
        </div>
        <div className="mb-3 w-full bg-gray-200 rounded-full dark:bg-gray-700">
          <div
            className={`text-sm text-white dark:text-white font-medium text-center py-1 px-2 leading-none rounded-full ${
              parkingWithDetails.available_capacity_percentage <= 33
                ? "bg-red-600 dark:bg-red-500"
                : parkingWithDetails.available_capacity_percentage <= 66
                ? "bg-yellow-400 dark:bg-yellow-500"
                : "bg-green-600 dark:bg-green-500 "
            }`}
            style={{
              width: `${parkingWithDetails.available_capacity_percentage}%`,
            }}
          >
            {" "}
            {parkingWithDetails.available_capacity}/
            {parkingWithDetails.total_capacity}
          </div>
        </div>
        <p className="mb-4 font-normal text-gray-700 dark:text-gray-200">
          Category: {parkingWithDetails.category}
        </p>
        
        <div className="mb-5 flex flex-col items-center justify-center rounded-lg overflow-hidden">
          <iframe
            src={`https://maps.google.com/maps?q=${parkingWithDetails.coordinates.latitude},${parkingWithDetails.coordinates.longitude}&z=15&output=embed`}
            width="100%"
            height="100%"
          ></iframe>
        </div>
        <NavLink
          target="_blank"
          to={`https://www.google.com/maps/search/?api=1&query=${parkingWithDetails.coordinates.latitude}%2C${parkingWithDetails.coordinates.longitude}&query=${parkingWithDetails.name}`}
        >
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-1 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Open in Google Maps
          </button>
        </NavLink>
      </div>
    </div>
  );
}
