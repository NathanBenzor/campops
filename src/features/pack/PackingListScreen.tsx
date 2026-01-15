import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useActiveTrip } from "../../app/state/ActiveTripContext";

export function PackingListScreen() {
  const { activeTripId } = useActiveTrip();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pack</Text>
      {!activeTripId ? (
        <Text style={styles.text}>
          Select a trip in the Trips tab to start packing.
        </Text>
      ) : (
        <Text style={styles.text}>
          Active Trip: {activeTripId}
          {"\n\n"}
          Next: we’ll generate packing items from a template and display them in
          a SectionList.
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
