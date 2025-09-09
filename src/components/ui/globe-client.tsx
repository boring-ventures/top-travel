"use client";
import dynamic from "next/dynamic";
import { World } from "./globe-demo";

// Dynamically import the World component with no SSR
const DynamicWorld = dynamic(() => Promise.resolve(World), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] sm:h-[600px] lg:h-[700px] xl:h-[800px] flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-gray-500">Loading globe...</div>
    </div>
  ),
});

export { DynamicWorld as World };
