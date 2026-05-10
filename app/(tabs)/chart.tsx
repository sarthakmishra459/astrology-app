import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import { useState } from "react";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";

import RashiTable from "@/components/RashiTable";
import  transformChart from "@/app/services/chartTransformer";

export default function Chart() {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [place, setPlace] = useState("Rourkela");

  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const [chartData, setChartData] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];
  const formatTime = (t: Date) =>
    `${t.getHours().toString().padStart(2, "0")}:${t
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

  const fetchChart = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://192.168.1.5:8000/chart", {
        params: {
          dob: formatDate(date),
          time: formatTime(time),
          place,
        },
      });

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
      <Text style={styles.header}>🔮 Kundli Generator</Text>

      <View style={styles.card}>
        {/* 📅 DATE */}
        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDate(true)}
        >
          <Text>{formatDate(date)}</Text>
        </TouchableOpacity>

        {showDate && (
          <DateTimePicker
            value={date}
            mode="date"
            onChange={(e, selected) => {
              setShowDate(false);
              if (selected) setDate(selected);
            }}
          />
        )}

        {/* ⏰ TIME */}
        <Text style={styles.label}>Time</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowTime(true)}
        >
          <Text>{formatTime(time)}</Text>
        </TouchableOpacity>

        {showTime && (
          <DateTimePicker
            value={time}
            mode="time"
            onChange={(e, selected) => {
              setShowTime(false);
              if (selected) setTime(selected);
            }}
          />
        )}

        {/* 🌍 PLACE (simple + clean) */}
        <Text style={styles.label}>Place</Text>
        <TextInput
          value={place}
          onChangeText={setPlace}
          placeholder="Enter city (e.g. Rourkela)"
          style={styles.input}
        />

        {/* 🔥 BUTTON */}
        <TouchableOpacity style={styles.button} onPress={fetchChart}>
          <Text style={styles.buttonText}>
            {loading ? "Generating..." : "Generate Chart"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🔥 MODAL */}
      <Modal visible={visible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>North Indian Chart</Text>

          <ScrollView style={{ width: "100%" }}>
            {chartData && <RashiTable chartData={chartData} />}
          </ScrollView>

          <TouchableOpacity onPress={() => setVisible(false)}>
            <Text style={styles.close}>Close</Text>
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
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#111",
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  label: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 14,
    borderRadius: 10,
    marginTop: 6,
    backgroundColor: "#fafafa",
  },

  button: {
    backgroundColor: "#4f46e5",
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  close: {
    marginTop: 15,
    fontSize: 18,
    color: "#4f46e5",
    fontWeight: "600",
  },
});