import React from "react";
import { View } from "react-native";

import Svg, {
  Polygon,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";

export default function NorthIndianChart({
  chartData,
}: any) {

  // 🔥 PLANETS GROUPED BY RASHI
  const planetsByRashi =
    chartData?.planetsByRashi || {};

  // 🔥 FIXED ZODIAC ORDER
  const RASHIS = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];

  // 🔥 CURRENT LAGNA
  const lagna = chartData?.lagna || "Aries";

  // 🔥 FIND ASC INDEX
  const lagnaIndex = RASHIS.findIndex(
    (r) =>
      r.toLowerCase() ===
      lagna.toLowerCase()
  );

  // 🔥 ROTATE SIGNS
  const rotatedRashis = [
    ...RASHIS.slice(lagnaIndex),
    ...RASHIS.slice(0, lagnaIndex),
  ];

  // 🔥 RASHI LABEL POSITIONS
  const labelPositions = [
    [195,130],
    [97,60],
    [75,78],
    [170,152],
    [75,227],
    [95,245],
    [195,170],
    [295,245],
    [320,227],
    [220,152],
    [320,77],
    [295,60],
  ];

  // 🔥 PLANET CENTER POSITIONS
  const centerMap: any = {
    0:[190,75],
    1:[100,30],
    2:[30,75],
    3:[90,150],
    4:[30,225],
    5:[90,278],
    6:[190,225],
    7:[290,278],
    8:[360,225],
    9:[290,150],
    10:[360,75],
    11:[290,30],
  };

  return (
    <View>

      <Svg
        width={320}
        height={320}
        viewBox="0 0 400 300"
      >

        {/* 🔥 GRADIENT */}
        <Defs>

          <LinearGradient
            id="grad"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <Stop
              offset="0%"
              stopColor="white"
            />

            <Stop
              offset="100%"
              stopColor="#f0f3bf"
            />

          </LinearGradient>

        </Defs>

        {/* 🔥 NORTH INDIAN CHART */}

        {/* 1 */}
        <Polygon
          points="100,225 200,300 300,225 200,150"
          fill="url(#grad)"
          stroke="black"
        />

        {/* 2 */}
        <Polygon
          points="100,225 0,300 200,300"
          fill="url(#grad)"
          stroke="black"
        />

        {/* 3 */}
        <Polygon
          points="0,150 0,300 100,225"
          fill="url(#grad)"
          stroke="black"
        />

        {/* 4 */}
        <Polygon
          points="0,150 100,225 200,150 100,75"
          fill="url(#grad)"
          stroke="black"
        />

        {/* 5 */}
        <Polygon
          points="0,0 0,150 100,75"
          fill="url(#grad)"
          stroke="black"
        />

        {/* 6 */}
        <Polygon
          points="0,0 100,75 200,0"
          fill="url(#grad)"
          stroke="black"
        />

        {/* 7 */}
        <Polygon
          points="100,75 200,150 300,75 200,0"
          fill="url(#grad)"
          stroke="black"
        />

        {/* 8 */}
        <Polygon
          points="200,0 300,75 400,0"
          fill="url(#grad)"
          stroke="black"
        />

        {/* 9 */}
        <Polygon
          points="300,75 400,150 400,0"
          fill="url(#grad)"
          stroke="black"
        />

        {/* 10 */}
        <Polygon
          points="300,75 200,150 300,225 400,150"
          fill="url(#grad)"
          stroke="black"
        />

        {/* 11 */}
        <Polygon
          points="300,225 400,300 400,150"
          fill="url(#grad)"
          stroke="black"
        />

        {/* 12 */}
        <Polygon
          points="300,225 200,300 400,300"
          fill="url(#grad)"
          stroke="black"
        />

        {/* 🔥 RASHI LABELS */}
        {rotatedRashis.map(
          (rashi, i) => (

            <SvgText
              key={i}

              x={labelPositions[i][0]}
              y={labelPositions[i][1]}

              fontSize="11"

              fill={
                i === 0
                  ? "red"
                  : "teal"
              }

              fontWeight={
                i === 0
                  ? "bold"
                  : "normal"
              }

              textAnchor="middle"
            >
              {rashi.slice(0,2)}

            </SvgText>
          )
        )}

        {/* 🔥 PLANETS */}
        {rotatedRashis.map(
          (rashi, i) => {

            const center =
              centerMap[i];

            const planets =
              planetsByRashi[
                rashi.toLowerCase()
              ] || [];

            return planets.map(
              (
                p: any,
                idx: number
              ) => (

                <SvgText
                  key={`${rashi}-${idx}`}

                  x={center[0]}

                  y={
                    center[1] +
                    idx * 10
                  }

                  fontSize="11"

                  textAnchor="middle"
                >

                  {p.name.slice(0,2)}

                </SvgText>
              )
            );
          }
        )}

      </Svg>

    </View>
  );
}