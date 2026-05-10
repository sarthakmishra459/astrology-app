import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useRef } from "react";
import axios from "axios";
import Markdown from "react-native-markdown-display";
import { Ionicons } from "@expo/vector-icons";
import { useKundli } from "@/context/KundliContext";
export default function AI() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const listRef = useRef<FlatList>(null);
  const {kundli} = useKundli();
  const askAI = async () => {
    if (!question.trim()) return;

    const userMsg = { role: "user", content: question };

    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");

    try {
      const res = await axios.post("http://192.168.1.5:8000/ai", {
        question,
        dob: kundli.dob,
        time: kundli.time,
        place: kundli.place,
      });

      const aiMsg = { role: "ai", content: res.data.answer };

      setMessages((prev) => [...prev, aiMsg]);

      // 🔥 auto scroll
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* 🔥 HEADER */}
      <Text style={styles.header}>✨ Astro AI</Text>

      {/* 🔥 CHAT */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={{ padding: 15, paddingBottom: 80 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.role === "user" ? styles.user : styles.ai,
            ]}
          >
            <Markdown>{item.content}</Markdown>
          </View>
        )}
      />

      {/* 🔥 INPUT BAR */}
      <View style={styles.inputContainer}>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          placeholder="Ask about career, finance..."
          style={styles.input}
          placeholderTextColor="#888"
        />

        <TouchableOpacity style={styles.sendButton} onPress={askAI}>
          <Ionicons name="send" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef2ff",
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    padding: 15,
    color: "#111",
  },

  bubble: {
    padding: 14,
    borderRadius: 16,
    marginVertical: 6,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  user: {
    backgroundColor: "#4f46e5",
    alignSelf: "flex-end",
  },

  ai: {
    backgroundColor: "white",
    alignSelf: "flex-start",
  },

  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },

  input: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },

  sendButton: {
    backgroundColor: "#4f46e5",
    padding: 12,
    borderRadius: 50,
  },
});