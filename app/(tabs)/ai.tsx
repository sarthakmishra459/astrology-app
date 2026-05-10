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
import { useRef, useState } from "react";
import axios from "axios";
import Markdown from "react-native-markdown-display";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useKundli } from "@/context/KundliContext";
import { AppColors, AppShadows } from "@/constants/theme";

type Message = {
  role: "user" | "ai";
  content: string;
};

const PROMPTS = [
  "How is my career growth?",
  "Explain my finance strength.",
  "What affects mental peace?",
];

export default function AI() {
  const insets = useSafeAreaInsets();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const listRef = useRef<FlatList>(null);
  const { kundli } = useKundli();

  const askAI = async (preset?: string) => {
    const finalQuestion = preset ?? question;
    if (!finalQuestion.trim()) return;

    const userMsg: Message = { role: "user", content: finalQuestion };

    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");

    try {
      const res = await axios.post("http://192.168.1.5:8000/ai", {
        question: finalQuestion,
        dob: kundli.dob,
        time: kundli.time,
        place: kundli.place,
      });

      const aiMsg: Message = { role: "ai", content: res.data.answer };

      setMessages((prev) => [...prev, aiMsg]);

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
      keyboardVerticalOffset={insets.top}
    >
      <View style={[styles.header, { marginTop: insets.top + 18 }]}>
        <View style={styles.mark}>
          <Ionicons name="chatbubble-ellipses-outline" size={22} color={AppColors.gold} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>Astro assistant</Text>
          <Text style={styles.title}>Ask With Context</Text>
          <Text style={styles.subtitle}>
            Answers use your saved birth details and chart signals.
          </Text>
        </View>
      </View>

      {messages.length === 0 && (
        <View style={styles.promptPanel}>
          <Text style={styles.promptTitle}>Start with a focused question</Text>
          <View style={styles.promptGrid}>
            {PROMPTS.map((item) => (
              <TouchableOpacity
                key={item}
                activeOpacity={0.82}
                style={styles.promptChip}
                onPress={() => askAI(item)}
              >
                <Ionicons name="sparkles-outline" size={15} color={AppColors.indigo} />
                <Text style={styles.promptText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={[
          styles.messages,
          { paddingBottom: insets.bottom + 112 },
        ]}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.role === "user" ? styles.userBubble : styles.aiBubble,
            ]}
          >
            {item.role === "user" ? (
              <Text style={styles.userText}>{item.content}</Text>
            ) : (
              <Markdown style={markdownStyles}>{item.content}</Markdown>
            )}
          </View>
        )}
      />

      <View style={[styles.inputContainer]}>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          placeholder="Ask about career, finance, relationships..."
          style={styles.input}
          placeholderTextColor="#9a8f82"
        />

        <TouchableOpacity activeOpacity={0.86} style={styles.sendButton} onPress={() => askAI()}>
          <Ionicons name="send" size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const markdownStyles = {
  body: {
    color: "#3c342a",
    fontSize: 14,
    lineHeight: 21,
  },
  strong: {
    color: AppColors.ink,
  },
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.background,
    flex: 1,
  },
  header: {
    alignItems: "center",
    backgroundColor: AppColors.ink,
    flexDirection: "row",
    gap: 13,
    margin: 18,
    marginBottom: 12,
    borderRadius: 8,
    padding: 18,
    ...AppShadows.card,
  },
  mark: {
    alignItems: "center",
    backgroundColor: "rgba(255,250,242,0.1)",
    borderColor: "rgba(255,250,242,0.18)",
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    color: AppColors.gold,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 3,
  },
  subtitle: {
    color: "#c9c5bc",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  promptPanel: {
    backgroundColor: AppColors.surfaceElevated,
    borderColor: AppColors.line,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 18,
    marginBottom: 10,
    padding: 14,
    ...AppShadows.soft,
  },
  promptTitle: {
    color: AppColors.ink,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 10,
  },
  promptGrid: {
    gap: 8,
  },
  promptChip: {
    alignItems: "center",
    backgroundColor: AppColors.surface,
    borderColor: AppColors.subtle,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    padding: 11,
  },
  promptText: {
    color: AppColors.ink,
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
  },
  messages: {
    padding: 18,
    paddingBottom: 96,
  },
  bubble: {
    borderRadius: 8,
    marginVertical: 6,
    maxWidth: "86%",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: AppColors.indigo,
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: AppColors.surfaceElevated,
    borderColor: AppColors.line,
    borderWidth: 1,
    ...AppShadows.soft,
  },
  userText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },
  inputContainer: {
    alignItems: "center",
    backgroundColor: AppColors.surfaceElevated,
    borderColor: AppColors.line,
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: "row",
    gap: 10,
    left: 0,
    padding: 12,
  },
  input: {
    backgroundColor: AppColors.surface,
    borderColor: AppColors.subtle,
    borderRadius: 8,
    borderWidth: 1,
    color: AppColors.ink,
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    minHeight: 46,
    paddingHorizontal: 13,
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: AppColors.indigo,
    borderRadius: 8,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
});
