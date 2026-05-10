import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NorthIndianChart from "@/components/north-indian-chart";
import transformChart from "@/app/services/chartTransformer";
import { useKundli } from "@/context/KundliContext";
import { AppColors, AppShadows } from "@/constants/theme";

export default function Chart() {
  const { kundli, setKundli } = useKundli();
  const [date, setDate] = useState(kundli.dob ? new Date(kundli.dob) : new Date());
  const insets = useSafeAreaInsets();
  const [timeObj, setTimeObj] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!kundli.time) return;

    const [h, m] = kundli.time.split(":");
    const t = new Date();
    t.setHours(Number(h));
    t.setMinutes(Number(m));
    setTimeObj(t);
  }, [kundli.time]);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const formatTime = (t: Date) =>
    `${t.getHours().toString().padStart(2, "0")}:${t
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

  const fetchChart = async () => {
    try {
      setLoading(true);

      const res = await axios.get("https://astro-backend-beryl.vercel.app/chart", {
        params: {
          dob: kundli.dob,
          time: kundli.time,
          place: kundli.place,
        },
      });

      setChartData(transformChart(res.data));
      setVisible(true);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const canGenerate = Boolean(kundli.dob && kundli.time && kundli.place);

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
      <View style={styles.headerBlock}>
        <View style={styles.mark}>
          <Ionicons name="sparkles-outline" size={22} color={AppColors.gold} />
        </View>
        <Text style={styles.eyebrow}>Birth chart</Text>
        <Text style={styles.header}>Create Your Kundli</Text>
        <Text style={styles.subheader}>
          Enter precise birth details to generate the chart used by insights and AI readings.
        </Text>
      </View>

      <View style={styles.card}>
        <FieldShell
          icon="calendar-outline"
          label="Date of Birth"
          value={kundli.dob || "Select birth date"}
          muted={!kundli.dob}
          onPress={() => setShowDate(true)}
        />

        {showDate && (
          <DateTimePicker
            value={date}
            mode="date"
            onChange={(e, selected) => {
              setShowDate(false);

              if (selected) {
                setDate(selected);
                setKundli((current) => ({
                  ...current,
                  dob: formatDate(selected),
                }));
              }
            }}
          />
        )}

        <FieldShell
          icon="time-outline"
          label="Birth Time"
          value={kundli.time || "Select birth time"}
          muted={!kundli.time}
          onPress={() => setShowTime(true)}
        />

        {showTime && (
          <DateTimePicker
            value={timeObj}
            mode="time"
            onChange={(e, selected) => {
              setShowTime(false);

              if (selected) {
                setTimeObj(selected);
                setKundli((current) => ({
                  ...current,
                  time: formatTime(selected),
                }));
              }
            }}
          />
        )}

        <View style={styles.textField}>
          <View style={styles.fieldIcon}>
            <Ionicons name="location-outline" size={18} color={AppColors.indigo} />
          </View>
          <View style={styles.fieldTextGroup}>
            <Text style={styles.label}>Birth Place</Text>
            <TextInput
              value={kundli.place}
              onChangeText={(v) =>
                setKundli((current) => ({
                  ...current,
                  place: v,
                }))
              }
              placeholder="City, state or country"
              placeholderTextColor="#9a8f82"
              style={styles.input}
            />
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.86}
          disabled={!canGenerate || loading}
          style={[styles.button, (!canGenerate || loading) && styles.buttonDisabled]}
          onPress={fetchChart}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Ionicons name="grid-outline" size={18} color="#ffffff" />
              <Text style={styles.buttonText}>Generate Chart</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.noteCard}>
        <Ionicons name="shield-checkmark-outline" size={20} color={AppColors.teal} />
        <Text style={styles.noteText}>
          The same birth details power the chart, life-area insights, and AI answers.
        </Text>
      </View>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalEyebrow}>Generated chart</Text>
              <Text style={styles.modalTitle}>North Indian Chart</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => setVisible(false)}>
              <Ionicons name="close" size={22} color={AppColors.ink} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {chartData && (
              <View style={styles.chartFrame}>
                <NorthIndianChart chartData={chartData} />
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

function FieldShell({
  icon,
  label,
  value,
  muted,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  muted?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.82} style={styles.field} onPress={onPress}>
      <View style={styles.fieldIcon}>
        <Ionicons name={icon} size={18} color={AppColors.indigo} />
      </View>
      <View style={styles.fieldTextGroup}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.fieldValue, muted && styles.mutedValue]}>{value}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9a8f82" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.background,
    flex: 1,
  },
  content: {
    padding: 18,
    paddingBottom: 32,
  },
  headerBlock: {
    backgroundColor: AppColors.ink,
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    padding: 20,
    ...AppShadows.card,
  },
  mark: {
    alignItems: "center",
    backgroundColor: "rgba(255,250,242,0.1)",
    borderColor: "rgba(255,250,242,0.18)",
    borderRadius: 8,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    marginBottom: 18,
    width: 42,
  },
  eyebrow: {
    color: AppColors.gold,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  header: {
    color: "#ffffff",
    fontSize: 31,
    fontWeight: "900",
  },
  subheader: {
    color: "#c9c5bc",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  card: {
    backgroundColor: AppColors.surfaceElevated,
    borderColor: AppColors.line,
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    ...AppShadows.card,
  },
  field: {
    alignItems: "center",
    backgroundColor: AppColors.surface,
    borderColor: AppColors.subtle,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 12,
    minHeight: 68,
    padding: 12,
  },
  textField: {
    alignItems: "center",
    backgroundColor: AppColors.surface,
    borderColor: AppColors.subtle,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 12,
    minHeight: 72,
    padding: 12,
  },
  fieldIcon: {
    alignItems: "center",
    backgroundColor: AppColors.indigoSoft,
    borderRadius: 8,
    height: 38,
    justifyContent: "center",
    marginRight: 12,
    width: 38,
  },
  fieldTextGroup: {
    flex: 1,
  },
  label: {
    color: AppColors.gold,
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  fieldValue: {
    color: AppColors.ink,
    fontSize: 16,
    fontWeight: "800",
  },
  mutedValue: {
    color: "#9a8f82",
  },
  input: {
    color: AppColors.ink,
    fontSize: 16,
    fontWeight: "800",
    margin: 0,
    padding: 0,
  },
  button: {
    alignItems: "center",
    backgroundColor: AppColors.indigo,
    borderRadius: 8,
    flexDirection: "row",
    gap: 9,
    justifyContent: "center",
    marginTop: 6,
    minHeight: 54,
    padding: 15,
  },
  buttonDisabled: {
    backgroundColor: "#9da7c9",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },
  noteCard: {
    alignItems: "center",
    backgroundColor: AppColors.tealSoft,
    borderColor: "#b7ebe4",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    padding: 13,
  },
  noteText: {
    color: "#134e4a",
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  modalContainer: {
    backgroundColor: AppColors.background,
    flex: 1,
    paddingTop: 54,
  },
  modalHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingBottom: 14,
  },
  modalEyebrow: {
    color: AppColors.gold,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  modalTitle: {
    color: AppColors.ink,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 2,
  },
  closeButton: {
    alignItems: "center",
    backgroundColor: AppColors.surfaceElevated,
    borderColor: AppColors.line,
    borderRadius: 8,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  modalScroll: {
    width: "100%",
  },
  modalContent: {
    alignItems: "center",
    padding: 18,
    paddingBottom: 36,
  },
  chartFrame: {
    alignItems: "center",
    backgroundColor: AppColors.surfaceElevated,
    borderColor: AppColors.line,
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    width: "100%",
    ...AppShadows.card,
  },
});
