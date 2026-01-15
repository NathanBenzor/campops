import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useActiveTrip } from "../../app/state/ActiveTripContext";

export function ReadinessScreen() {
  const { activeTripId } = useActiveTrip();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Readiness</Text>
      {!activeTripId ? (
        <Text style={styles.text}>
          Select a trip in the Trips tab to see readiness.
        </Text>
      ) : (
        <Text style={styles.text}>
          Active Trip: {activeTripId}
          {"\n\n"}
          Next: we’ll compute packed vs total and show missing counts by
          category.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 10,
    color: "#111827",
  },
  text: { color: "#374151" },
});
