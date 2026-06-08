"use client";

import { Spinner } from "@heroui/react";

export default function Loader() {
  return (
    <div className="bg-white/30 fixed inset-0 flex items-center justify-center gap-4">
      <Spinner size="lg" />
    </div>
  );
}
