import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  Pressable,
  RefreshControl,
} from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

import { useActiveTrip } from "../../app/state/ActiveTripContext";
import {
  listPackingItems,
  togglePacked,
  PackingItemRow,
} from "../../data/packingRepo";
import type { RootTabParamList } from "../../app/navigation/types";

type PackRoute = RouteProp<RootTabParamList, "PackTab">;
type PackNav = BottomTabNavigationProp<RootTabParamList, "PackTab">;

type Section = { title: string; data: PackingItemRow[] };

export function PackingListScreen() {
  const { activeTripId } = useActiveTrip();
  const route = useRoute<PackRoute>();
  const navigation = useNavigation<PackNav>();

  const filter = route.params?.filter;
  const category = route.params?.category;

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

  const filteredItems = useMemo(() => {
    let list = items;

    if (filter === "missing") {
      list = list.filter((it) => it.packed === 0);
    }
    if (category) {
      list = list.filter((it) => it.category === category);
    }

    return list;
  }, [items, filter, category]);

  const sections: Section[] = useMemo(() => {
    const map = new Map<string, PackingItemRow[]>();
    for (const it of filteredItems) {
      const arr = map.get(it.category) ?? [];
      arr.push(it);
      map.set(it.category, arr);
    }
    return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
  }, [filteredItems]);

  async function onToggle(item: PackingItemRow) {
    const next = item.packed === 1 ? 0 : 1;

    // Optimistic update
    setItems((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, packed: next } : p)),
    );

    try {
      await togglePacked(item.id, next === 1);
    } catch {
      // Rollback
      setItems((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, packed: item.packed } : p)),
      );
    }
  }

  function clearFilter() {
    navigation.setParams({ filter: undefined, category: undefined });
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

  const hasFilter = filter === "missing" || !!category;
  const filterLabelParts: string[] = [];
  if (filter === "missing") filterLabelParts.push("Missing only");
  if (category) filterLabelParts.push(category);
  const filterLabel = filterLabelParts.join(" • ");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pack</Text>

      {hasFilter ? (
        <View style={styles.filterBanner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.filterTitle}>Filter applied</Text>
            <Text style={styles.filterText}>{filterLabel}</Text>
          </View>

          <Pressable onPress={clearFilter} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </Pressable>
        </View>
      ) : null}

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
            <Text style={styles.emptyTitle}>No items match this view</Text>
            <Text style={styles.emptyText}>
              {hasFilter
                ? "Clear the filter to see all items."
                : "Go to Trips → open a trip → tap “Apply Template” to generate a packing list."}
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

  filterBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#111827",
    backgroundColor: "white",
    marginBottom: 12,
  },
  filterTitle: { fontSize: 13, fontWeight: "800", color: "#111827" },
  filterText: { marginTop: 2, color: "#374151" },
  clearButton: {
    borderWidth: 1,
    borderColor: "#111827",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "white",
  },
  clearButtonText: { fontWeight: "800", color: "#111827" },

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
  checkboxChecked: { backgroundColor: "#111827" },
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
