import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TripsStack } from "../../features/trips/TripsStack";
import { PackingListScreen } from "../../features/pack/PackingListScreen";
import { ReadinessScreen } from "../../features/readiness/ReadinessScreen";
import type { RootTabParamList } from "./types";

const Tab = createBottomTabNavigator<RootTabParamList>();

export function TabsNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="TripsTab"
        component={TripsStack}
        options={{ title: "Trips" }}
      />
      <Tab.Screen
        name="PackTab"
        component={PackingListScreen}
        options={{ title: "Pack" }}
      />
      <Tab.Screen
        name="ReadinessTab"
        component={ReadinessScreen}
        options={{ title: "Readiness" }}
      />
    </Tab.Navigator>
  );
}
