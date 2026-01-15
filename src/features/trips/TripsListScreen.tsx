import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { Trip, TripsStackParamList } from "../../app/navigation/types";
import { listTrips } from "../../data/tripsRepo";
import { useActiveTrip } from "../../app/state/ActiveTripContext";

type Nav = NativeStackNavigationProp<TripsStackParamList, "TripsList">;

export function TripsListScreen() {
  const navigation = useNavigation<Nav>();
  const { activeTripId, setActiveTripId } = useActiveTrip();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listTrips();
      setTrips(data);

      // If no active trip selected yet, default to most recent trip.
      if (!activeTripId && data.length) setActiveTripId(data[0].id);
    } finally {
      setLoading(false);
    }
  }, [activeTripId, setActiveTripId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  useEffect(() => {
    // initial load fallback
    load();
  }, [load]);

  const renderItem = ({ item }: { item: Trip }) => {
    const isActive = item.id === activeTripId;

    return (
      <Pressable
        onPress={() => navigation.navigate("TripDetail", { tripId: item.id })}
        onLongPress={() => setActiveTripId(item.id)}
        style={[styles.card, isActive && styles.cardActive]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.name}</Text>
          {isActive ? <Text style={styles.badge}>ACTIVE</Text> : null}
        </View>

        <Text style={styles.meta}>
          {item.startDate} → {item.endDate}
        </Text>
        <Text style={styles.meta}>
          {item.tripType.replace("_", " ")} • group: {item.groupSize}
        </Text>

        <Text style={styles.hint}>Tap to view. Long-press to set active.</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.primaryButton}
        onPress={() => navigation.navigate("TripForm", { mode: "create" })}
      >
        <Text style={styles.primaryButtonText}>New Trip</Text>
      </Pressable>

      <FlatList
        data={trips}
        keyExtractor={(t) => t.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} />
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No trips yet</Text>
            <Text style={styles.emptyText}>
              Create your first trip to generate a packing list.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  primaryButton: {
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "white",
    marginBottom: 10,
  },
  cardActive: {
    borderColor: "#111827",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 16, fontWeight: "700", color: "#111827" },
  badge: { fontSize: 12, fontWeight: "700", color: "#111827" },
  meta: { marginTop: 4, color: "#374151" },
  hint: { marginTop: 8, fontSize: 12, color: "#6B7280" },
  empty: { padding: 16, marginTop: 20 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: "#111827",
  },
  emptyText: { color: "#374151" },
});
