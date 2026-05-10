import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === "kundli") {
            iconName = "person-circle-outline";
          } else if (route.name === "chart") {
            iconName = "grid-outline";
          } else if (route.name === "ai") {
            iconName = "chatbubble-ellipses-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tabs.Screen name="chart" options={{ title: "Chart" }} />
      <Tabs.Screen name="ai" options={{ title: "AI" }} />
    </Tabs>
  );
}