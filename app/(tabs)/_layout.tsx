import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppColors } from "@/constants/theme";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 10);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === "kundli") {
            iconName = "person-circle-outline";
          } else if (route.name === "chart") {
            iconName = "grid-outline";
          } else if (route.name === "insights") {
            iconName = "analytics-outline";
          } else if (route.name === "ai") {
            iconName = "chatbubble-ellipses-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: AppColors.indigo,
        tabBarInactiveTintColor: "#9a8f82",
        tabBarStyle: {
          backgroundColor: AppColors.surfaceElevated,
          borderTopColor: AppColors.line,
          height: 58 + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },
      })}
    >
      <Tabs.Screen name="chart" options={{ title: "Chart" }} />
      <Tabs.Screen
        name="insights"
        options={{
          title: "Insights",
        }}
      />
      <Tabs.Screen name="ai" options={{ title: "AI" }} />
    </Tabs>
  );
}
