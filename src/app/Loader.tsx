"use client";

import { CircularProgress } from "react-loader-spinner";

export default function Loader() {
  return (
    <div className="fixed bg-black/30 inset-0 flex items-center justify-center">
      <CircularProgress
        height="100"
        width="100"
        color="#000"
        visible={true}
        strokeWidth={2}
        animationDuration={1}
      />
    </div>
  );
}
