import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";

import { useState, useEffect } from "react";

import axios from "axios";

import DateTimePicker from "@react-native-community/datetimepicker";

import NorthIndianChart from "@/components/north-indian-chart";

import transformChart from "@/app/services/chartTransformer";

import { useKundli } from "@/context/KundliContext";

export default function Chart() {

  const { kundli, setKundli } = useKundli();

  // 🔥 local picker states
  const [date, setDate] = useState(
    kundli.dob
      ? new Date(kundli.dob)
      : new Date()
  );

  const [timeObj, setTimeObj] = useState(new Date());

  const [showDate, setShowDate] = useState(false);

  const [showTime, setShowTime] = useState(false);

  const [chartData, setChartData] = useState<any>(null);

  const [visible, setVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  // 🔥 initialize time object from context
  useEffect(() => {

    if (kundli.time) {

      const [h, m] = kundli.time.split(":");

      const t = new Date();

      t.setHours(Number(h));

      t.setMinutes(Number(m));

      setTimeObj(t);
    }

  }, []);

  const formatDate = (d: Date) =>
    d.toISOString().split("T")[0];

  const formatTime = (t: Date) =>
    `${t.getHours().toString().padStart(2, "0")}:${t
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

  // 🔥 API CALL
  const fetchChart = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        "https://astro-backend-beryl.vercel.app/chart",
        {
          params: {
            dob: kundli.dob,
            time: kundli.time,
            place: kundli.place,
          },
        }
      );

      const transformed = transformChart(res.data);

      setChartData(transformed);

      setVisible(true);

    } catch (e) {

      console.log(e);

    } finally {

      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* 🔥 HEADER */}
      <Text style={styles.header}>
        🔮 Kundli Generator
      </Text>

      {/* 🔥 CARD */}
      <View style={styles.card}>

        {/* DATE */}
        <Text style={styles.label}>
          Date of Birth
        </Text>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDate(true)}
        >
          <Text style={styles.inputText}>
            {kundli.dob}
          </Text>
        </TouchableOpacity>

        {showDate && (
          <DateTimePicker
            value={date}
            mode="date"
            onChange={(e, selected) => {

              setShowDate(false);

              if (selected) {

                setDate(selected);

                setKundli({
                  ...kundli,
                  dob: formatDate(selected),
                });
              }
            }}
          />
        )}

        {/* TIME */}
        <Text style={styles.label}>
          Birth Time
        </Text>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowTime(true)}
        >
          <Text style={styles.inputText}>
            {kundli.time}
          </Text>
        </TouchableOpacity>

        {showTime && (
          <DateTimePicker
            value={timeObj}
            mode="time"
            onChange={(e, selected) => {

              setShowTime(false);

              if (selected) {

                setTimeObj(selected);

                setKundli({
                  ...kundli,
                  time: formatTime(selected),
                });
              }
            }}
          />
        )}

        {/* PLACE */}
        <Text style={styles.label}>
          Birth Place
        </Text>

        <TextInput
          value={kundli.place}
          onChangeText={(v) =>
            setKundli({
              ...kundli,
              place: v,
            })
          }
          placeholder="Enter city"
          placeholderTextColor="#999"
          style={styles.input}
        />

        {/* BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={fetchChart}
        >
          <Text style={styles.buttonText}>
            {loading
              ? "Generating..."
              : "Generate Chart"}
          </Text>
        </TouchableOpacity>

      </View>

      {/* 🔥 MODAL */}
      <Modal
        visible={visible}
        animationType="slide"
      >

        <View style={styles.modalContainer}>

          <Text style={styles.modalTitle}>
            North Indian Chart
          </Text>

          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{
              alignItems: "center",
              paddingBottom: 30,
            }}
          >

            {chartData && (
              <NorthIndianChart
                chartData={chartData}
              />
            )}

          </ScrollView>

          <TouchableOpacity
            onPress={() => setVisible(false)}
          >
            <Text style={styles.close}>
              Close
            </Text>
          </TouchableOpacity>

        </View>

      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f3f6fb",
    padding: 20,
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#111827",
  },

  card: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 20,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,

    elevation: 6,
  },

  label: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 14,
    marginBottom: 6,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",

    padding: 15,

    borderRadius: 14,

    backgroundColor: "#fafafa",
  },

  inputText: {
    color: "#111827",
    fontSize: 15,
  },

  button: {
    backgroundColor: "#4f46e5",

    padding: 16,

    borderRadius: 14,

    marginTop: 24,

    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 60,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#111827",
  },

  close: {
    marginTop: 10,
    marginBottom: 30,
    fontSize: 18,
    color: "#4f46e5",
    fontWeight: "600",
  },

});