import React, { useCallback, useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useActiveTrip } from "../../app/state/ActiveTripContext";
import {
  getReadinessStats,
  ReadinessStats,
  CategoryMissing,
} from "../../data/packingRepo";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function ReadinessScreen() {
  const { activeTripId } = useActiveTrip();

  const [stats, setStats] = useState<ReadinessStats | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!activeTripId) return;
    setLoading(true);
    try {
      const s = await getReadinessStats(activeTripId);
      setStats(s);
    } finally {
      setLoading(false);
    }
  }, [activeTripId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const progress = useMemo(() => {
    const pct = stats?.percentPacked ?? 0;
    return clamp(pct, 0, 100);
  }, [stats]);

  if (!activeTripId) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Readiness</Text>
        <Text style={styles.text}>
          Select an active trip in Trips to see readiness.
        </Text>
      </View>
    );
  }

  // If a trip exists but has no packing items yet
  const noItems = (stats?.totalCount ?? 0) === 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Readiness</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>
          {noItems
            ? "No packing list yet"
            : `${stats?.packedCount ?? 0} / ${stats?.totalCount ?? 0} packed`}
        </Text>

        <Text style={styles.summaryMeta}>
          {noItems
            ? "Apply a template to generate packing items."
            : `${progress}% complete • ${stats?.missingCount ?? 0} remaining`}
        </Text>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <Text style={styles.sectionHeader}>Missing by category</Text>

      <FlatList
        data={stats?.missingByCategory ?? []}
        keyExtractor={(it) => it.category}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} />
        }
        renderItem={({ item }) => <CategoryRow item={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              {noItems ? "Nothing to show" : "All packed"}
            </Text>
            <Text style={styles.emptyText}>
              {noItems
                ? "Go to Trips → open a trip → tap “Apply Template”, then check items off in Pack."
                : "You have no remaining unpacked items for this trip."}
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

function CategoryRow({ item }: { item: CategoryMissing }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowTitle}>{item.category}</Text>
      <Text style={styles.rowBadge}>{item.missingCount}</Text>
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

  summaryCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "white",
    marginBottom: 16,
  },
  summaryTitle: { fontSize: 18, fontWeight: "800", color: "#111827" },
  summaryMeta: { marginTop: 6, color: "#374151" },

  progressTrack: {
    marginTop: 12,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  progressFill: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#111827",
  },

  sectionHeader: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 8,
  },
  rowTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
  rowBadge: {
    minWidth: 28,
    textAlign: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#111827",
    color: "#111827",
    fontWeight: "800",
  },

  empty: { padding: 16, marginTop: 20 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: "#111827",
  },
  emptyText: { color: "#374151" },
});
