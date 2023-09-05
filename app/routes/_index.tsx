import type { V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Gent Realtime" },
    {
      name: "description",
      content: "Realtime Occupation of Blue-bikes and Parking Spots in Gent",
    },
  ];
};

export default function Index() {
  return (
    <div className="bg-whitepy-3 sm:py-4 lg:py-6 text-center ">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-4 w-full">
        <h2 className="pt-40 text-4xl font-bold text-black">
          Realtime Occupation of Blue-bikes and Parking Spots in Gent
        </h2>
        <h5 className="mt-3 text-xl font-bold text-gray-500">
          Using Gent Open Data Portaal
        </h5>
      </div>
    </div>
  );
}
