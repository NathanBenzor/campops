import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { TripsStackParamList, TripType } from "../../app/navigation/types";
import { createTrip } from "../../data/tripsRepo";
import { useActiveTrip } from "../../app/state/ActiveTripContext";

type Nav = NativeStackNavigationProp<TripsStackParamList, "TripForm">;
type R = RouteProp<TripsStackParamList, "TripForm">;

function isValidDate(d: string) {
  // Minimal check: YYYY-MM-DD and valid Date parse
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
  const dt = new Date(d + "T00:00:00Z");
  return !Number.isNaN(dt.getTime());
}

export function TripFormScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<R>();
  const { setActiveTripId } = useActiveTrip();

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("2026-01-14");
  const [endDate, setEndDate] = useState("2026-01-15");
  const [tripType, setTripType] = useState<TripType>("car_camping");
  const [groupSize, setGroupSize] = useState("1");

  async function onSave() {
    if (!name.trim()) {
      Alert.alert("Missing name", "Please enter a trip name.");
      return;
    }
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      Alert.alert("Invalid date", "Use YYYY-MM-DD format (e.g., 2026-02-01).");
      return;
    }
    const gs = parseInt(groupSize, 10);
    if (Number.isNaN(gs) || gs < 1 || gs > 30) {
      Alert.alert("Invalid group size", "Enter a number between 1 and 30.");
      return;
    }

    try {
      const id = await createTrip({
        name: name.trim(),
        startDate,
        endDate,
        tripType,
        groupSize: gs,
      });
      setActiveTripId(id);
      navigation.replace("TripDetail", { tripId: id });
    } catch (e: any) {
      Alert.alert("Save failed", e?.message ?? String(e));
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Trip name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="e.g., Sedona Weekend"
        style={styles.input}
      />

      <Text style={styles.label}>Start date (YYYY-MM-DD)</Text>
      <TextInput
        value={startDate}
        onChangeText={setStartDate}
        style={styles.input}
      />

      <Text style={styles.label}>End date (YYYY-MM-DD)</Text>
      <TextInput
        value={endDate}
        onChangeText={setEndDate}
        style={styles.input}
      />

      <Text style={styles.label}>Trip type</Text>
      <View style={styles.segmentRow}>
        <Pressable
          style={[
            styles.segment,
            tripType === "car_camping" && styles.segmentActive,
          ]}
          onPress={() => setTripType("car_camping")}
        >
          <Text
            style={[
              styles.segmentText,
              tripType === "car_camping" && styles.segmentTextActive,
            ]}
          >
            Car Camping
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.segment,
            tripType === "backpacking" && styles.segmentActive,
          ]}
          onPress={() => setTripType("backpacking")}
        >
          <Text
            style={[
              styles.segmentText,
              tripType === "backpacking" && styles.segmentTextActive,
            ]}
          >
            Backpacking
          </Text>
        </Pressable>
      </View>

      <Text style={styles.label}>Group size</Text>
      <TextInput
        value={groupSize}
        onChangeText={setGroupSize}
        keyboardType="number-pad"
        style={styles.input}
      />

      <Pressable style={styles.primaryButton} onPress={onSave}>
        <Text style={styles.primaryButtonText}>Save Trip</Text>
      </Pressable>

      <Text style={styles.helper}>
        Tip: For now, dates are plain text inputs to keep the project simple. We
        can add a date picker later.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: {
    marginTop: 12,
    marginBottom: 6,
    fontWeight: "700",
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "white",
  },
  segmentRow: { flexDirection: "row", gap: 10 },
  segment: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "white",
  },
  segmentActive: { borderColor: "#111827" },
  segmentText: { color: "#374151", fontWeight: "600" },
  segmentTextActive: { color: "#111827" },
  primaryButton: {
    marginTop: 18,
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: { color: "white", fontSize: 16, fontWeight: "700" },
  helper: { marginTop: 12, color: "#6B7280", fontSize: 12 },
});
