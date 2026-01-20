import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  Pressable,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useActiveTrip } from "../../app/state/ActiveTripContext";
import {
  listPackingItems,
  togglePacked,
  PackingItemRow,
} from "../../data/packingRepo";

type Section = { title: string; data: PackingItemRow[] };

export function PackingListScreen() {
  const { activeTripId } = useActiveTrip();
  const [items, setItems] = useState<PackingItemRow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!activeTripId) return;
    setLoading(true);
    try {
      const data = await listPackingItems(activeTripId);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [activeTripId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const sections: Section[] = useMemo(() => {
    const map = new Map<string, PackingItemRow[]>();
    for (const it of items) {
      const arr = map.get(it.category) ?? [];
      arr.push(it);
      map.set(it.category, arr);
    }
    return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
  }, [items]);

  async function onToggle(item: PackingItemRow) {
    const next = item.packed === 1 ? 0 : 1;

    // optimistic update
    setItems((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, packed: next } : p)),
    );

    try {
      await togglePacked(item.id, next === 1);
    } catch {
      // rollback if needed
      setItems((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, packed: item.packed } : p)),
      );
    }
  }

  if (!activeTripId) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Pack</Text>
        <Text style={styles.text}>
          Select an active trip in Trips to view its packing list.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pack</Text>

      <SectionList
        sections={sections}
        keyExtractor={(it) => it.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} />
        }
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <Pressable onPress={() => onToggle(item)} style={styles.row}>
            <View
              style={[
                styles.checkbox,
                item.packed === 1 && styles.checkboxChecked,
              ]}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.rowTitle,
                  item.packed === 1 && styles.rowTitleDone,
                ]}
              >
                {item.name}
              </Text>
              {item.quantity > 1 ? (
                <Text style={styles.rowMeta}>Qty: {item.quantity}</Text>
              ) : null}
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No packing items yet</Text>
            <Text style={styles.emptyText}>
              Go to Trips → open a trip → tap “Apply Template” to generate a
              packing list.
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
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

  sectionHeader: {
    marginTop: 14,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#111827",
    borderRadius: 6,
    backgroundColor: "transparent",
  },
  checkboxChecked: {
    backgroundColor: "#111827",
  },
  rowTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
  rowTitleDone: { opacity: 0.5, textDecorationLine: "line-through" },
  rowMeta: { marginTop: 2, fontSize: 12, color: "#6B7280" },

  empty: { padding: 16, marginTop: 20 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: "#111827",
  },
  emptyText: { color: "#374151" },
});
