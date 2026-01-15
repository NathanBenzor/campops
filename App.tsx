import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { RootNavigator } from "./src/app/navigation/RootNavigator";
import { ActiveTripProvider } from "./src/app/state/ActiveTripContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <ActiveTripProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </ActiveTripProvider>
    </SafeAreaProvider>
  );
}
