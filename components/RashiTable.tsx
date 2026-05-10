import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ORDER = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];

export default function RashiTable({ chartData }: any) {
  if (!chartData || !chartData.planetsByRashi) {
    return <Text>Loading chart...</Text>;
  }

  return (
    <View style={styles.container}>
      {ORDER.map((sign) => {
        const planets = chartData.planetsByRashi[sign] || [];
        const isLagna = sign === chartData.lagna;

        return (
          <View key={sign} style={styles.row}>
            {/* LEFT SIDE (SIGN + ASC) */}
            <View style={styles.left}>
              <Text style={[styles.sign, isLagna && styles.lagna]}>
                {sign.toUpperCase()}
              </Text>

              {isLagna && <Text style={styles.asc}>(ASC)</Text>}
            </View>

            {/* RIGHT SIDE (PLANETS) */}
            <View style={styles.right}>
              <Text style={styles.planets}>
                {planets.length === 0
                  ? "-"
                  : planets
                      .map((p: any) => {
                        let suffix = "";

                        if (p.isRetrograde) suffix += "(R)";
                        if (p.isCombust) suffix += "(C)";

                        return `${p.name}${suffix}`;
                      })
                      .join(", ")}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "white",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    width: 140,
  },

  right: {
    flex: 1,
    alignItems: "flex-end",
  },

  sign: {
    fontWeight: "bold",
    fontSize: 16,
  },

  asc: {
    color: "red",
    marginLeft: 6,
    fontWeight: "bold",
  },

  lagna: {
    color: "red",
  },

  planets: {
    fontSize: 15,
    textAlign: "right",
  },
});
