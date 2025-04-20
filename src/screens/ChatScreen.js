import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { StatusBar } from "expo-status-bar";

const ChatScreen = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { _id: Date.now().toString(), text: "Hello Farhaan 👋 I'm your friend chatbot. How may I help you?", sender: "bot" },
    { _id: (Date.now() + 1).toString(), text: "What can I do for you today?", sender: "bot" }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [visibleWords, setVisibleWords] = useState([]);
  const [responseText, setResponseText] = useState([]);

  const fadeAnimations = useRef([]);
  const flatListRef = useRef(null);
  const translateTabY = useRef(new Animated.Value(0)).current;
  const translateDocY = useRef(new Animated.Value(500)).current;

  const memoizedChatHistory = React.useMemo(() => chatHistory, [chatHistory]);

  const tabs = [
    {
      id: "1",
      name: "Emergency contact",
      icon: "🩺",
      borderBlockColor: "#ef4444",
      backgroundColor: "#fee2e2",
    },
    {
      id: "2",
      name: "Schedule a session",
      icon: "🛒",
      borderBlockColor: "#9333ea",
      backgroundColor: "#f3e8ff",
    },
    {
      id: "3",
      name: "Group",
      icon: "📃",
      borderBlockColor: "#eab308",
      backgroundColor: "#fef9c3",
    },
    {
      id: "4",
      name: "Favorites",
      icon: "❤️",
      borderBlockColor: "#22c55e",
      backgroundColor: "#dcfce7",
    },
    {
      id: "5",
      name: "Pharmacy",
      icon: "💊",
      borderBlockColor: "#3b82f6",
      backgroundColor: "#dbeafe",
    },
  ];

  const cleanText = (text) => {
    console.log("Clean text: " + text);
    return text
      .replace(/\t+/g, " ")    // Tabs to spaces
      .replace(/\s+/g, " ")    // Collapse all whitespace to single space
      .replace(/\n{2,}/g, "\n"); // Remove excessive new lines
  };

  const sendMessageToBackend = async (userMessage) => {
    console.log("Function ke andar: " + userMessage);
    try {
      const response = await axios.post("http://192.168.198.209:8000/chat/",
        {
          session_id: "123",
          user_input: userMessage
        }
      );

      console.log(userMessage);
  
      console.log(response.data.response);
      return cleanText(response.data.response);
    } catch (error) {
      console.error("Error communicating with backend:", error);
      return "Sorry, I couldn't process your request right now.";
    }
  };
  
  const saveMessages = async (text, sender) => {
    const response = await axios.post("http://192.168.198.209:3000/api/bot/bot-chat", { text, sender });
    const data = response.data;
    console.log(data.message);
  }

  const handleSend = async () => {
    if (message.trim() === "") return;    

    const userMessageText = message;
    saveMessages(userMessageText, "user");
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { _id: Date.now().toString(), text: userMessageText, sender: "user" },
    ]);
    
    setMessage("");
    setIsLoading(true);

    console.log(userMessageText);
    const botResponse = await sendMessageToBackend(userMessageText);
    console.log("Message aaya");
    

    setIsTyping(true);
    setResponseText(botResponse.trim().split(/\s+/).filter(word => word !== ''));
    const botMessageText = botResponse.trim();

    saveMessages(botMessageText, "bot");
  };

  const renderMessage = ({ item }) => {
    const isBot = item.sender === "bot";

    return (
      <View
        style={[
          styles.messageBubble,
          isBot ? styles.botBubble : styles.userBubble,
        ]}
      >
        {item.id === "typing" ? (
          <View style={styles.typingContainer}>
            {visibleWords.map((word, index) => (
              <Animated.Text
                key={index}
                style={[
                  styles.botText,
                  styles.messageText,
                  { opacity: fadeAnimations.current[index] },
                ]}
              >
                {word}{" "}
              </Animated.Text>
            ))}
          </View>
        ) : (
          <Text
            style={[
              styles.messageText,
              isBot ? styles.botText : styles.userText,
            ]}
          >
            {item.text}
          </Text>
        )}
      </View>
    );
  };

  useEffect(() => {
    if (responseText.length === 0) return;

    fadeAnimations.current = responseText.map(() => new Animated.Value(0));

    setVisibleWords([]);

    let i = 0;
    const totalWords = responseText.length;

    const interval = setInterval(() => {
      setVisibleWords((prev) => {
        if (i >= totalWords) return prev;
        const newWords = [...prev, responseText[i]];

        Animated.timing(fadeAnimations.current[i], {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();

        i++;
        return newWords;
      });

      if (i >= totalWords) {
        clearInterval(interval);

        setTimeout(() => {
          setChatHistory((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              text: responseText.join(" "),
              sender: "bot",
            },
          ]);
          setVisibleWords([]);
          setResponseText([]);
          setIsTyping(false);
          setIsLoading(false);
        }, 100); // Small delay to ensure smooth transition
      }

      flatListRef.current?.scrollToEnd({ animated: true });
    }, 70);

    return () => {
      clearInterval(interval);
      fadeAnimations.current = []; // Prevent memory leaks
    };
  }, [responseText]);

  useEffect(() => {
    const getMessages = async () => {
      try {
          const response = await axios.get("http://192.168.198.209:3000/api/bot/bot-chat");
          const data = response.data;
          // console.log(data.messages);

          // Ensure `data.messages` is correctly added to chatHistory
          setChatHistory((prev) => [...prev, ...data.messages]); 
      } catch (error) {
          console.error("Error fetching messages:", error);
      }
  };
    getMessages();
  }, [])

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
}, [chatHistory]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <FlatList
        ref={flatListRef}
        data={[
          ...memoizedChatHistory,
          ...(isTyping
            ? [{ id: "typing", text: visibleWords.join(" "), sender: "bot" }]
            : []),
        ]}
        renderItem={renderMessage}
        style={styles.chatContainer}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.chatContent}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      <Animated.View style={{ transform: [{ translateY: translateTabY }] }}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type message..."
            value={message}
            onChangeText={setMessage}
            placeholderTextColor="#999"
          />

          <TouchableOpacity style={styles.emojiButton}>
            <Ionicons name="happy-outline" size={32} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sendButton,
              message.trim() ? styles.sendButtonActive : null,
            ]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Ionicons
              name="send"
              size={20}
              color={message.trim() ? "#fff" : ""}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    height: 60,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  chatContent: {
    flexGrow: 1,
    padding: 10,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginVertical: 5,
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 5,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#4FD1C5",
    borderBottomRightRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  botText: {
    color: "#333",
    lineHeight: 20,
  },
  userText: {
    color: "#fff",
  },

  typingContainer: { flexDirection: "row", flexWrap: "wrap", lineHeight: 20 },
  typingText: { color: "red", fontSize: 16, lineHeight: 20 },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  emojiButton: {
    marginHorizontal: 8,
  },
  emoji: {
    fontSize: 24,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderBlockColor: "#f5f5f5",
    borderWidth: 0.3,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
  },
  cameraButton: {
    marginHorizontal: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonActive: {
    backgroundColor: "#4FD1C5",
  },
  tabContainer: {
    backgroundColor: "#fff",
  },
  tabContent: {
    paddingHorizontal: 5,
    paddingTop: 8,
    paddingVertical: 12,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderWidth: 2,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 4,
    gap: 0,
  },
  tabIcon: {
    fontSize: 14,
    marginBottom: 4,
    marginRight: 5,
  },
  tabName: {
    fontSize: 16,
    color: "black",
    fontWeight: 600,
  },
});

export default ChatScreen;
