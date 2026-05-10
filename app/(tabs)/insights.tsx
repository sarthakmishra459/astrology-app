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
import { useSafeAreaInsets } from "react-native-safe-area-context";

import InsightCard, { InsightCardData } from "@/components/insights-card";
import { useKundli } from "@/context/KundliContext";
import { AppColors, AppShadows } from "@/constants/theme";

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
  const insets = useSafeAreaInsets();
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
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + 18,
          paddingBottom: insets.bottom + 96,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <View>
          <Text style={styles.header}>Life Insights</Text>
          <Text style={styles.subheader}>
            A clear read on strengths, pressure points, and timing across life areas
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
          <Ionicons name="location-outline" size={16} color={AppColors.indigo} />
          <Text style={styles.birthText}>
            {kundli.place} | {kundli.dob} | {kundli.time}
          </Text>
        </View>
      ) : null}

      {strongestCard && (
        <View style={styles.snapshot}>
          <View style={styles.snapshotIcon}>
            <Ionicons name="analytics-outline" size={18} color={AppColors.gold} />
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
          <ActivityIndicator size="large" color={AppColors.indigo} />
          <Text style={styles.loaderText}>Reading chart signals</Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.emptyState}>
          <Ionicons name="information-circle-outline" size={28} color={AppColors.gold} />
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
    backgroundColor: AppColors.background,
    flex: 1,
  },
  content: {
    padding: 18,
    paddingBottom: 30,
  },
  topBar: {
    alignItems: "center",
    backgroundColor: AppColors.ink,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    padding: 18,
    ...AppShadows.card,
  },
  header: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "900",
  },
  subheader: {
    color: "#c9c5bc",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
    maxWidth: 290,
  },
  refreshButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,250,242,0.1)",
    borderColor: "rgba(255,250,242,0.18)",
    borderRadius: 8,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  birthStrip: {
    alignItems: "center",
    backgroundColor: AppColors.surfaceElevated,
    borderColor: AppColors.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    marginBottom: 12,
    padding: 11,
    ...AppShadows.soft,
  },
  birthText: {
    color: AppColors.ink,
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
  },
  snapshot: {
    alignItems: "center",
    backgroundColor: AppColors.ink,
    borderColor: "#2f3448",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 11,
    marginBottom: 14,
    padding: 13,
    ...AppShadows.card,
  },
  snapshotIcon: {
    alignItems: "center",
    backgroundColor: "rgba(255,250,242,0.1)",
    borderRadius: 8,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  snapshotTextGroup: {
    flex: 1,
  },
  snapshotLabel: {
    color: "#c9c5bc",
    fontSize: 12,
    fontWeight: "700",
  },
  snapshotTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 2,
  },
  loader: {
    alignItems: "center",
    backgroundColor: AppColors.surfaceElevated,
    borderColor: AppColors.line,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 220,
    ...AppShadows.soft,
  },
  loaderText: {
    color: AppColors.muted,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 12,
  },
  emptyState: {
    alignItems: "center",
    backgroundColor: AppColors.surfaceElevated,
    borderColor: AppColors.line,
    borderRadius: 8,
    borderWidth: 1,
    padding: 24,
    ...AppShadows.soft,
  },
  emptyTitle: {
    color: AppColors.ink,
    fontSize: 17,
    fontWeight: "900",
    marginTop: 9,
  },
  emptyText: {
    color: AppColors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
    textAlign: "center",
  },
});
