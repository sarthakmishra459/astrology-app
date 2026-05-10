import React from "react";
import { View } from "react-native";
import Svg, { Polygon, Text as SvgText, Defs, LinearGradient, Stop } from "react-native-svg";

export default function NorthIndianChart({ chartData }: any) {
  const planetsByHouse = chartData?.planetsByHouse || {};

  const getPlanets = (house: number) => {
    const planets = planetsByHouse[house] || [];
    return planets
      .map((p: any) => p.name.slice(0, 2))
      .join(" ");
  };

  return (
    <View>
      <Svg width={350} height={300} viewBox="0 0 400 300">
        {/* 🔥 Gradient */}
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="white" />
            <Stop offset="100%" stopColor="#f0f3bf" />
          </LinearGradient>
        </Defs>

        {/* 🔥 Houses (converted from your Python EXACTLY) */}

        {/* 1 */}
        <Polygon points="100,225 200,300 300,225 200,150" fill="url(#grad)" stroke="black"/>
        {/* 2 */}
        <Polygon points="100,225 0,300 200,300" fill="url(#grad)" stroke="black"/>
        {/* 3 */}
        <Polygon points="0,150 0,300 100,225" fill="url(#grad)" stroke="black"/>
        {/* 4 */}
        <Polygon points="0,150 100,225 200,150 100,75" fill="url(#grad)" stroke="black"/>
        {/* 5 */}
        <Polygon points="0,0 0,150 100,75" fill="url(#grad)" stroke="black"/>
        {/* 6 */}
        <Polygon points="0,0 100,75 200,0" fill="url(#grad)" stroke="black"/>
        {/* 7 */}
        <Polygon points="100,75 200,150 300,75 200,0" fill="url(#grad)" stroke="black"/>
        {/* 8 */}
        <Polygon points="200,0 300,75 400,0" fill="url(#grad)" stroke="black"/>
        {/* 9 */}
        <Polygon points="300,75 400,150 400,0" fill="url(#grad)" stroke="black"/>
        {/* 10 */}
        <Polygon points="300,75 200,150 300,225 400,150" fill="url(#grad)" stroke="black"/>
        {/* 11 */}
        <Polygon points="300,225 400,300 400,150" fill="url(#grad)" stroke="black"/>
        {/* 12 */}
        <Polygon points="300,225 200,300 400,300" fill="url(#grad)" stroke="black"/>

        {/* 🔥 House Numbers */}
        {[7,8,9,10,11,12,1,2,3,4,5,6].map((num, i) => {
          const positions = [
            [195,130],[97,60],[75,78],[170,152],[75,227],[95,245],
            [195,170],[295,245],[320,227],[220,152],[320,77],[295,60]
          ];
          return (
            <SvgText
              key={i}
              x={positions[i][0]}
              y={positions[i][1]}
              fontSize="12"
              fill="teal"
              textAnchor="middle"
            >
              {num}
            </SvgText>
          );
        })}

        {/* 🔥 Planets */}
        {Object.keys(planetsByHouse).map((house: any) => {
          const centerMap: any = {
            1:[190,75],2:[100,30],3:[30,75],4:[90,150],
            5:[30,225],6:[90,278],7:[190,225],8:[290,278],
            9:[360,225],10:[290,150],11:[360,75],12:[290,30],
          };

          const center = centerMap[house];
          const planets = planetsByHouse[house] || [];

          return planets.map((p: any, i: number) => (
            <SvgText
              key={house + i}
              x={center[0]}
              y={center[1] + i * 12}
              fontSize="11"
              textAnchor="middle"
            >
              {p.name.slice(0, 2)}
            </SvgText>
          ));
        })}
      </Svg>
    </View>
  );
}