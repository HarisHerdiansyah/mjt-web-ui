"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MJTForm from "./MJTForm";
import TripCard from "./TripCard";

const queryClient = new QueryClient();

export default function AppContent() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-6 overflow-hidden space-y-6 min-h-screen">
        <MJTForm />
        <TripCard />
      </div>
    </QueryClientProvider>
  );
}
