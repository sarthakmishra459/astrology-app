import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

import InsightCard, { InsightCardData } from "@/components/insights-card";
import { useKundli } from "@/context/KundliContext";

type InsightsResponse = {
  birth_details: {
    dob: string;
    time: string;
    place: string;
  };
  cards: InsightCardData[];
};

const API_BASE_URL = "https://astro-backend-beryl.vercel.app";

export default function Insights() {
  const { kundli } = useKundli();
  const [cards, setCards] = useState<InsightCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canFetch = Boolean(kundli.dob && kundli.time && kundli.place);

  const fetchInsights = useCallback(async () => {
    if (!canFetch) {
      setCards([]);
      setError("Enter birth date, time, and place in the Chart tab first.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await axios.get<InsightsResponse>(`${API_BASE_URL}/insights/`, {
        params: {
          dob: kundli.dob,
          time: kundli.time,
          place: kundli.place,
        },
      });

      if ("error" in res.data) {
        setError(String((res.data as any).error));
        setCards([]);
        return;
      }

      setCards(res.data.cards ?? []);
    } catch (e) {
      console.log(e);
      setError("Unable to load insights right now.");
    } finally {
      setLoading(false);
    }
  }, [canFetch, kundli.dob, kundli.place, kundli.time]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const strongestCard = cards.reduce<InsightCardData | null>((best, card) => {
    if (!best || card.score > best.score) return card;
    return best;
  }, null);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <View>
          <Text style={styles.header}>Life Insights</Text>
          <Text style={styles.subheader}>
            Chart-based strengths across major life areas
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={fetchInsights}
          style={styles.refreshButton}
        >
          <Ionicons name="refresh" size={19} color="#1d4ed8" />
        </TouchableOpacity>
      </View>

      {kundli.place ? (
        <View style={styles.birthStrip}>
          <Ionicons name="location-outline" size={16} color="#475569" />
          <Text style={styles.birthText}>
            {kundli.place} | {kundli.dob} | {kundli.time}
          </Text>
        </View>
      ) : null}

      {strongestCard && (
        <View style={styles.snapshot}>
          <View style={styles.snapshotIcon}>
            <Ionicons name="analytics-outline" size={18} color="#1d4ed8" />
          </View>
          <View style={styles.snapshotTextGroup}>
            <Text style={styles.snapshotLabel}>Strongest area</Text>
            <Text style={styles.snapshotTitle}>
              {strongestCard.title} at {strongestCard.score}/100
            </Text>
          </View>
        </View>
      )}

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#1d4ed8" />
          <Text style={styles.loaderText}>Reading chart signals</Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.emptyState}>
          <Ionicons name="information-circle-outline" size={28} color="#64748b" />
          <Text style={styles.emptyTitle}>Insights unavailable</Text>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      )}

      {!loading &&
        !error &&
        cards.map((card) => <InsightCard key={card.key} card={card} />)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8fafc",
    flex: 1,
  },
  content: {
    padding: 18,
    paddingBottom: 30,
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  header: {
    color: "#0f172a",
    fontSize: 30,
    fontWeight: "900",
  },
  subheader: {
    color: "#64748b",
    fontSize: 13,
    marginTop: 4,
  },
  refreshButton: {
    alignItems: "center",
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
    borderRadius: 8,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  birthStrip: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    marginBottom: 12,
    padding: 11,
  },
  birthText: {
    color: "#475569",
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
  },
  snapshot: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#dbeafe",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 11,
    marginBottom: 14,
    padding: 13,
  },
  snapshotIcon: {
    alignItems: "center",
    backgroundColor: "#eff6ff",
    borderRadius: 8,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  snapshotTextGroup: {
    flex: 1,
  },
  snapshotLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "700",
  },
  snapshotTitle: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 2,
  },
  loader: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 220,
  },
  loaderText: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 12,
  },
  emptyState: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderRadius: 8,
    borderWidth: 1,
    padding: 24,
  },
  emptyTitle: {
    color: "#0f172a",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 9,
  },
  emptyText: {
    color: "#64748b",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
    textAlign: "center",
  },
});
