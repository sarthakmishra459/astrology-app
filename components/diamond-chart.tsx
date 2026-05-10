import React from "react";
import Svg, { Line, Text as SvgText } from "react-native-svg";

type Planet = {
  sign: string;
  house: number;
};

type Props = {
  chart: {
    lagna: { sign: string };
    planets: Record<string, Planet>;
  };
};

const SYMBOLS: Record<string, string> = {
  Sun: "☉",
  Moon: "☽",
  Mars: "♂",
  Mercury: "☿",
  Jupiter: "♃",
  Venus: "♀",
  Saturn: "♄",
  Rahu: "☊",
  Ketu: "☋",
};

// 🔥 FIXED NORTH INDIAN SIGN POSITIONS
const SIGN_POSITIONS: Record<string, { x: number; y: number }> = {};

export default function DiamondChart({ chart }: Props) {
  const size = 320;
  const mid = size / 2;

  // 🔥 Define positions dynamically (so size can change later)
  const positions = {
    Aries: { x: mid, y: size - 25 },
    Taurus: { x: mid + 70, y: size - 70 },
    Gemini: { x: size - 30, y: mid + 40 },
    Cancer: { x: size - 20, y: mid },
    Leo: { x: size - 70, y: 60 },
    Virgo: { x: mid + 70, y: 30 },
    Libra: { x: 25, y: mid },
    Scorpio: { x: 60, y: mid + 70 },
    Sagittarius: { x: 60, y: 80 },
    Capricorn: { x: mid, y: 25 },
    Aquarius: { x: mid - 70, y: 30 },
    Pisces: { x: mid - 70, y: size - 70 },
  };

  // 🔥 Group planets by SIGN (IMPORTANT FIX)
  const grouped: Record<string, string[]> = {};

  Object.entries(chart.planets).forEach(([name, p]) => {
    if (!grouped[p.sign]) grouped[p.sign] = [];
    grouped[p.sign].push(SYMBOLS[name] || name.slice(0, 2));
  });

  return (
    <Svg width={size} height={size}>
      {/* Diamond */}
      <Line x1={mid} y1={0} x2={size} y2={mid} stroke="black" />
      <Line x1={size} y1={mid} x2={mid} y2={size} stroke="black" />
      <Line x1={mid} y1={size} x2={0} y2={mid} stroke="black" />
      <Line x1={0} y1={mid} x2={mid} y2={0} stroke="black" />

      {/* Cross */}
      <Line x1={mid} y1={0} x2={mid} y2={size} stroke="black" />
      <Line x1={0} y1={mid} x2={size} y2={mid} stroke="black" />

      {/* Diagonals */}
      <Line x1={0} y1={0} x2={size} y2={size} stroke="black" />
      <Line x1={size} y1={0} x2={0} y2={size} stroke="black" />

      {/* 🔥 Render Signs */}
      {Object.entries(positions).map(([sign, pos]) => {
        const planets = grouped[sign] || [];
        const isLagna = sign === chart.lagna.sign;

        return (
          <React.Fragment key={sign}>
            {/* Sign Name */}
            <SvgText
              x={pos.x}
              y={pos.y}
              fontSize="13"
              fontWeight={isLagna ? "bold" : "normal"}
              textAnchor="middle"
            >
              {sign.slice(0, 3)}
            </SvgText>

            {/* Planets */}
            <SvgText
              x={pos.x}
              y={pos.y + 16}
              fontSize="11"
              textAnchor="middle"
            >
              {planets.join(" ")}
            </SvgText>

            {/* Lagna Marker */}
            {isLagna && (
              <SvgText
                x={pos.x}
                y={pos.y + 30}
                fontSize="10"
                textAnchor="middle"
              >
                Lagna
              </SvgText>
            )}
          </React.Fragment>
        );
      })}
    </Svg>
  );
}