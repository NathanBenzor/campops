import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { TripsStackParamList } from "../../app/navigation/types";
import { TripsListScreen } from "./TripsListScreen";
import { TripDetailScreen } from "./TripDetailScreen";
import { TripFormScreen } from "./TripFormScreen";

const Stack = createNativeStackNavigator<TripsStackParamList>();

export function TripsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TripsList"
        component={TripsListScreen}
        options={{ title: "Trips" }}
      />
      <Stack.Screen
        name="TripDetail"
        component={TripDetailScreen}
        options={{ title: "Trip" }}
      />
      <Stack.Screen
        name="TripForm"
        component={TripFormScreen}
        options={{ title: "New Trip" }}
      />
    </Stack.Navigator>
  );
}
