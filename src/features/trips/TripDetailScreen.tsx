import React, { useCallback, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import type { TripsStackParamList, Trip } from "../../app/navigation/types";
import { getTripById } from "../../data/tripsRepo";
import { useActiveTrip } from "../../app/state/ActiveTripContext";

type R = RouteProp<TripsStackParamList, "TripDetail">;

export function TripDetailScreen() {
  const route = useRoute<R>();
  const { tripId } = route.params;

  const { activeTripId, setActiveTripId } = useActiveTrip();

  const [trip, setTrip] = useState<Trip | null>(null);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        const t = await getTripById(tripId);
        if (mounted) setTrip(t);
      })();
      return () => {
        mounted = false;
      };
    }, [tripId])
  );

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Trip not found</Text>
      </View>
    );
  }

  const isActive = trip.id === activeTripId;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{trip.name}</Text>
      <Text style={styles.meta}>
        {trip.startDate} → {trip.endDate}
      </Text>
      <Text style={styles.meta}>
        {trip.tripType.replace("_", " ")} • group: {trip.groupSize}
      </Text>

      <Pressable
        style={[styles.primaryButton, isActive && styles.primaryButtonDisabled]}
        onPress={() => setActiveTripId(trip.id)}
        disabled={isActive}
      >
        <Text style={styles.primaryButtonText}>
          {isActive ? "Active Trip" : "Set as Active"}
        </Text>
      </Pressable>

      <View style={styles.noteBox}>
        <Text style={styles.noteTitle}>Next up</Text>
        <Text style={styles.noteText}>
          We will add “Apply template” and the packing list in the Pack tab once
          you’re comfortable with Expo + SQLite.
        </Text>
      </View>
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
  meta: { color: "#374151", marginBottom: 6 },
  primaryButton: {
    marginTop: 14,
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonDisabled: { opacity: 0.5 },
  primaryButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
  noteBox: {
    marginTop: 18,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "white",
  },
  noteTitle: { fontWeight: "700", marginBottom: 6, color: "#111827" },
  noteText: { color: "#374151" },
});
