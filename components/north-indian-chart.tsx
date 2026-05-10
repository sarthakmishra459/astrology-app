import React from "react";
import { View } from "react-native";
import Svg, { Path, Line, Text as SvgText, G } from "react-native-svg";

const GLYPHS: any = {
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

export default function NorthIndianChart({ chartData }: any) {
  const size = 320;
  const center = size / 2;
  const outer = size * 0.45;
  const inner = size * 0.15;

  const rashiOrder = [
    "aries","taurus","gemini","cancer","leo","virgo",
    "libra","scorpio","sagittarius","capricorn","aquarius","pisces"
  ];

  // 🔥 EXACT BLOG LOGIC
  const lagnaIndex = rashiOrder.indexOf(
    chartData.lagna.toLowerCase()
  );

  const angles = [
    90,120,150,180,210,240,270,300,330,0,30,60
  ];

  const rashis = angles.map((angle, i) => {
    const index = (i + lagnaIndex) % 12;
    return { rashi: rashiOrder[index], angle };
  });

  const getPos = (angle: number, dist: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: center + Math.cos(rad) * dist,
      y: center - Math.sin(rad) * dist,
    };
  };

  return (
    <View>
      <Svg width={size} height={size}>
        {/* Diamond */}
        <Path
          d={`M ${center},${center - outer}
              L ${center + outer},${center}
              L ${center},${center + outer}
              L ${center - outer},${center} Z`}
          fill="white"
          stroke="black"
          strokeWidth={2}
        />

        {/* Inner */}
        <Path
          d={`M ${center},${center - inner}
              L ${center + inner},${center}
              L ${center},${center + inner}
              L ${center - inner},${center} Z`}
          fill="none"
          stroke="black"
        />

        {/* Cross */}
        <Line x1={center} y1={0} x2={center} y2={size} stroke="black" />
        <Line x1={0} y1={center} x2={size} y2={center} stroke="black" />

        {/* 🔥 EXACT RENDER */}
        {rashis.map(({ rashi, angle }) => {
          const pos = getPos(angle, (outer + inner) / 2);

          const planets = chartData.planetsByRashi[rashi] || [];
          const isLagna = rashi === chartData.lagna.toLowerCase();

          return (
            <G key={rashi}>
              <SvgText
                x={pos.x}
                y={pos.y - 25}
                fontSize={9}
                fill={isLagna ? "red" : "#999"}
                textAnchor="middle"
              >
                {rashi.charAt(0).toUpperCase() + rashi.slice(1)}
                {isLagna && " (ASC)"}
              </SvgText>

              {planets.map((p: any, i: number) => (
                <SvgText
                  key={p.name}
                  x={pos.x}
                  y={pos.y - 5 + i * 16}
                  fontSize={13}
                  textAnchor="middle"
                >
                  {GLYPHS[p.name]}
                  {p.isRetrograde && "℞"}
                </SvgText>
              ))}
            </G>
          );
        })}
      </Svg>
    </View>
  );
}