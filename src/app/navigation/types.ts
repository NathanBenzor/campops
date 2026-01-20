export type TripType = "car_camping" | "backpacking";

export type Trip = {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  tripType: TripType;
  groupSize: number;
  createdAt: string;
  updatedAt: string;
};

export type TripsStackParamList = {
  TripsList: undefined;
  TripDetail: { tripId: string };
  TripForm: { mode: "create" | "edit"; tripId?: string };
};

export type RootTabParamList = {
  TripsTab: undefined;
  PackTab: { filter?: "missing"; category?: string } | undefined;
  ReadinessTab: undefined;
};
