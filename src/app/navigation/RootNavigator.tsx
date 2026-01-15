import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { TabsNavigator } from "./TabsNavigator";
import { initDb } from "../../data/db";

export function RootNavigator() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await initDb();
        if (mounted) setReady(true);
      } catch (e: any) {
        Alert.alert("DB init failed", e?.message ?? String(e));
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <TabsNavigator />;
}
