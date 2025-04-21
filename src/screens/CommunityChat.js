import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../utils/FirebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  deleteDoc,
  toDate
} from "firebase/firestore";
import { Alert } from "react-native";

const CommunityChat = ({ route, navigation }) => {
  const { communityId } = route.params;
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [userName, setUserName] = useState(null);
  const [communityName, setCommunityName] = useState(null);

  const flatListRef = useRef(null);
  const chatRef = collection(db, "messages");

  const validateMessage = async () => {
    try {
      const text = message.trim();
      console.log(text);

      const response = await axios.post(
        "http://192.168.198.209:8000/send_message",
        { message: text },
        { headers: { "Content-Type": "application/json" } }
      );
      const data = response.data;
      const score = data.score;

      console.log(score);

      if (score < 0) {
        Alert.alert(
          "Negative Message Detected",
          "Your message contains harmful or derogatory content and cannot be sent.",
          [{ text: "OK" }]
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("Message validation failed:", error);
      Alert.alert(
        "Error",
        "Failed to validate the message. Please try again later.",
        [{ text: "OK" }]
      );
      return false;
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !userName) return;

    setMessage("");

    const validation = await validateMessage();
    if (!validation) return;

    await addDoc(collection(db, `communities/${communityName}/messages`), {
      text: message,
      sender: userName,
      timestamp: serverTimestamp(),
    });

    // console.log(message);
  };

  const formatTimestamp = (firebaseTimestamp) => {
    if (!firebaseTimestamp) return "";

    let date;

    // Firestore Timestamp object case
    if (firebaseTimestamp instanceof Timestamp) {
      date = firebaseTimestamp.toDate(); // Convert to JavaScript Date
    }
    // Case where timestamp is already in milliseconds
    else if (firebaseTimestamp.seconds) {
      date = new Date(firebaseTimestamp.seconds * 1000);
    }
    // Regular JavaScript Date string case
    else {
      date = new Date(firebaseTimestamp);
    }

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const renderMessage = ({ item }) => {
    if (!userName) return;
    const isUser = item.sender === userName;

    return (
      <View style={{ marginBottom: 10 }}>
        {/* Sender Name */}
        {!isUser && <Text style={styles.senderText}>{item.sender}</Text>}

        <View
          style={[
            styles.messageBubble,
            !isUser ? styles.botBubble : styles.userBubble,
          ]}
        >
          {/* Message Text */}
          <Text
            style={[
              styles.messageText,
              !isUser ? styles.botText : styles.userText,
            ]}
          >
            {item.text}
          </Text>

          {/* Timestamp */}
          <Text
            style={[
              styles.timestampText,
              { color: isUser ? "#ffffffb3" : "#888" },
            ]}
          >
            {formatTimestamp(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [chatHistory]);

  useEffect(() => {
    console.log("Username is " + userName);
  }, [userName]);

  useEffect(() => {
    const fetchCommunityName = async () => {
      const name = await AsyncStorage.getItem("communityName");
      setCommunityName(name);
      navigation.setOptions({
        title: name,
      });
    };

    fetchCommunityName();
  }, [navigation]);

  useEffect(() => {
    if (!communityName) return;

    const messagesRef = collection(db, `communities/${communityName}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      snapshot.docs.forEach((doc) => {
        const messageData = doc.data();
        if (messageData.timestamp?.toDate() < twentyFourHoursAgo) {
          deleteDoc(doc.ref); // Delete old messages
        }
      });

      setChatHistory(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });

    return () => unsubscribe();
  }, [communityName]);

  useEffect(() => {
    const getUsername = async () => {
      const name = await AsyncStorage.getItem("name");
      setUserName(name);
    };

    getUsername();
  }, [userName]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ textAlign: "center", color: "", fontSize: 10 }}>
        Messages will get automatically deleted after 24 hours
      </Text>

      <FlatList
        ref={flatListRef}
        data={chatHistory}
        renderItem={renderMessage}
        style={styles.chatContainer}
        keyExtractor={(item) => item.timestamp}
        contentContainerStyle={styles.chatContent}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffff",
  },
  subGreetingText: {
    fontSize: 14,
    textAlign: "center",
    color: "#A1A4B2",
    marginTop: 5,
    marginBottom: 10,
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
  senderText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#666",
    alignSelf: "flex-start",
    marginBottom: 2,
  },
  messageBubble: {
    flexDirection: "row",
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "flex-end",
    // marginVertical: 5,
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 5,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#8E67FD",
    borderBottomRightRadius: 5,
  },
  messageText: {
    fontSize: 16,
    maxWidth: "80%",
  },
  botText: {
    color: "#333",
    lineHeight: 20,
  },
  userText: {
    color: "#fff",
  },
  timestampText: {
    marginLeft: 6,
    fontSize: 10,
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

export default CommunityChat;
