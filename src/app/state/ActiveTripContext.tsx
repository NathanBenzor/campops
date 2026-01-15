import React, { createContext, useContext, useMemo, useState } from "react";

type ActiveTripContextValue = {
  activeTripId: string | null;
  setActiveTripId: (id: string | null) => void;
};

const ActiveTripContext = createContext<ActiveTripContextValue | undefined>(
  undefined
);

export function ActiveTripProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTripId, setActiveTripId] = useState<string | null>(null);

  const value = useMemo(
    () => ({ activeTripId, setActiveTripId }),
    [activeTripId]
  );

  return (
    <ActiveTripContext.Provider value={value}>
      {children}
    </ActiveTripContext.Provider>
  );
}

export function useActiveTrip() {
  const ctx = useContext(ActiveTripContext);
  if (!ctx)
    throw new Error("useActiveTrip must be used within ActiveTripProvider");
  return ctx;
}
