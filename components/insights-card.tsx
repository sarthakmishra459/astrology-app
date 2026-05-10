import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Collapsible from "react-native-collapsible";
import Svg, { Circle } from "react-native-svg";
import { AppColors, AppShadows } from "@/constants/theme";

export type InsightCardData = {
  key: string;
  domain: string;
  title: string;
  area: string;
  score: number;
  strength: "strong" | "average" | "weak";
  tone: "supportive" | "mixed" | "needs_attention";
  summary: string;
  primary_planets: string[];
  highlights: string[];
  challenges: string[];
  timing?: string | null;
  signal_count: number;
};

type Props = {
  card: InsightCardData;
};

const toneColors = {
  supportive: {
    accent: AppColors.green,
    surface: AppColors.greenSoft,
    border: "#b6e8c8",
    text: "#14532d",
  },
  mixed: {
    accent: AppColors.gold,
    surface: AppColors.goldSoft,
    border: "#f1d49d",
    text: "#7c4a03",
  },
  needs_attention: {
    accent: AppColors.rose,
    surface: AppColors.roseSoft,
    border: "#f6b8b2",
    text: "#7a271a",
  },
};

const domainIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  finance: "wallet-outline",
  education: "school-outline",
  career: "briefcase-outline",
  mental: "leaf-outline",
  relationship: "heart-outline",
};

function ScoreRing({ score, color }: { score: number; color: string }) {
  const size = 70;
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;

  return (
    <View style={styles.scoreWrap}>
      <Svg width={size} height={size}>
        <Circle
          stroke="#e5e7eb"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
        />
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={progress}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.scoreTextWrap}>
        <Text style={styles.scoreText}>{score}</Text>
      </View>
    </View>
  );
}

export default function InsightCard({ card }: Props) {
  const [collapsed, setCollapsed] = useState(true);
  const colors = toneColors[card.tone];
  const strengthLabel = {
    strong: "Strong",
    average: "Average",
    weak: "Needs Attention",
  }[card.strength];

  return (
    <View style={[styles.card, { borderColor: colors.border }]}>
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={() => setCollapsed(!collapsed)}
        style={styles.header}
      >
        <View style={styles.titleGroup}>
          <View style={[styles.iconBox, { backgroundColor: colors.surface }]}>
            <Ionicons
              name={domainIcons[card.domain] ?? "sparkles-outline"}
              size={20}
              color={colors.accent}
            />
          </View>

          <View style={styles.titleTextGroup}>
            <Text style={styles.title}>{card.title}</Text>
            <Text style={styles.area} numberOfLines={2}>
              {card.area}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <ScoreRing score={card.score} color={colors.accent} />
          <Ionicons
            name={collapsed ? "chevron-down" : "chevron-up"}
            size={22}
            color={AppColors.muted}
          />
        </View>
      </TouchableOpacity>

      <View style={styles.summaryRow}>
        <View style={[styles.badge, { backgroundColor: colors.surface }]}>
          <Text style={[styles.badgeText, { color: colors.text }]}>
            {strengthLabel.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.signalCount}>{card.signal_count} chart signals</Text>
      </View>

      <Text style={styles.summary}>{card.summary}</Text>

      <Collapsible collapsed={collapsed}>
        <View style={styles.expanded}>
          {card.primary_planets.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Primary planets</Text>
              <View style={styles.pillRow}>
                {card.primary_planets.map((planet) => (
                  <View key={planet} style={styles.planetPill}>
                    <Ionicons name="planet-outline" size={14} color={AppColors.indigo} />
                    <Text style={styles.planetText}>{planet}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {card.timing && (
            <View style={[styles.timingBox, { borderColor: colors.border }]}>
              <Ionicons name="time-outline" size={18} color={colors.accent} />
              <Text style={styles.timingText}>{card.timing}</Text>
            </View>
          )}

          {card.highlights.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Highlights</Text>
              {card.highlights.map((item) => (
                <View key={item} style={styles.driverRow}>
                  <Ionicons name="checkmark-circle" size={18} color="#16a34a" />
                  <Text style={styles.driverText}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          {card.challenges.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Challenges</Text>
              <View style={styles.challengeGrid}>
                {card.challenges.map((item) => (
                  <View key={item} style={styles.challengeChip}>
                    <Ionicons name="alert-circle-outline" size={15} color="#b91c1c" />
                    <Text style={styles.challengeText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </Collapsible>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.surfaceElevated,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 14,
    padding: 14,
    ...AppShadows.card,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 74,
  },
  titleGroup: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    paddingRight: 12,
  },
  iconBox: {
    alignItems: "center",
    borderRadius: 8,
    height: 38,
    justifyContent: "center",
    marginRight: 12,
    width: 38,
  },
  titleTextGroup: {
    flex: 1,
  },
  title: {
    color: AppColors.ink,
    fontSize: 18,
    fontWeight: "800",
  },
  area: {
    color: AppColors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  headerRight: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  scoreWrap: {
    alignItems: "center",
    height: 70,
    justifyContent: "center",
    position: "relative",
    width: 70,
  },
  scoreTextWrap: {
    alignItems: "center",
    height: 70,
    justifyContent: "center",
    position: "absolute",
    width: 70,
  },
  scoreText: {
    color: AppColors.ink,
    fontSize: 17,
    fontWeight: "800",
  },
  summaryRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  signalCount: {
    color: AppColors.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  summary: {
    color: "#3c342a",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
  },
  expanded: {
    borderTopColor: AppColors.subtle,
    borderTopWidth: 1,
    marginTop: 14,
    paddingTop: 14,
  },
  section: {
    marginTop: 14,
  },
  sectionTitle: {
    color: AppColors.ink,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  planetPill: {
    alignItems: "center",
    backgroundColor: AppColors.surface,
    borderColor: AppColors.subtle,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  planetText: {
    color: AppColors.ink,
    fontSize: 12,
    fontWeight: "700",
  },
  timingBox: {
    alignItems: "center",
    backgroundColor: AppColors.surface,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
    padding: 11,
  },
  timingText: {
    color: AppColors.ink,
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
  },
  driverRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 8,
    marginBottom: 9,
  },
  driverText: {
    color: "#3c342a",
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
  challengeGrid: {
    gap: 8,
  },
  challengeChip: {
    alignItems: "flex-start",
    backgroundColor: AppColors.roseSoft,
    borderColor: "#f6b8b2",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    padding: 10,
  },
  challengeText: {
    color: "#7a271a",
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 17,
  },
});
