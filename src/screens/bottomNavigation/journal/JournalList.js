// screens/JournalList.js
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import { CommonActions } from "@react-navigation/native";
import Constants from "expo-constants";

const JournalList = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("This week");

  const [notes, setNotes] = useState([]);
  const [token, setToken] = useState("");

  const nodeBackend = Constants.expoConfig?.extra?.nodeBackend;

  const handlelogout = async () => {
    try {
      // Wait for the async operation to complete
      await AsyncStorage.removeItem("token");
      console.log("Token removed successfully");

      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "LoginScreen" }],
          })
        );
      }, 200);
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) setToken(token);
      // console.log("TOKEN: " +token)
    };

    getToken();
  }, []);

  const fetchNotes = async () => {
    console.log("Fetch notes ke andar aaya");
    // console.log(token);
    try {
      const response = await axios.get(
        `${nodeBackend}/api/journal`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        console.log("gadbad hai");
      } else {
        console.log("HUUUHUUU");
      }

      // console.log(response.data.message);
      // console.log("Fetch notes khatam");
      const notes = response.data;
      console.log(notes);
      setNotes(notes);
    } catch (err) {
      handlelogout();
      console.log(err);
    }
  };
  useEffect(() => {
    if (!token) return;
    fetchNotes();
  }, [token]);

  // const notes = [
  //     {
  //         id: '1',
  //         title: 'Reading notes',
  //         date: '10.21.21',
  //         content: 'Use a calendar for publishing on social media. For example, a photo on Monday, a question on Tuesday, information the next day...'
  //     },
  //     {
  //         id: '2',
  //         title: 'Movies to see',
  //         date: '10.17.21',
  //         content: 'Here are 101 movies everyone should watch once. I believe there\'s a mix of movies to see here which attracts us more than others. Here\'s my top 5 screen plot twist, and you...'
  //     },
  //     {
  //         id: '3',
  //         title: 'Things to buy',
  //         date: '10.12.21',
  //         content: '- Clothes for winter because it\'s cold out here\n- Take a look for some car my driving gonna be better than before\n- Some groceries, because they are cheaper than...'
  //     },
  //     {
  //         id: '4',
  //         title: 'Books to read',
  //         date: '10.09.21',
  //         content: 'Here is the booklist, continue...'
  //     },
  //     {
  //         id: '5',
  //         title: 'Website UI',
  //         date: '10.03.21',
  //         content: 'There is Beautiful website...'
  //     },
  //     {
  //         id: '6',
  //         title: "Anne's birthday",
  //         date: '09.30.21',
  //         content: "For Anne's Birthday, Sarah would all things like that. It was a birthday party at the park where they buy some food, begin to organize the list for her to organize everything."
  //     },
  //     {
  //         id: '7',
  //         title: 'Grocery list',
  //         date: '09.29.21',
  //         content: "- Pasta - this is a great basic\n- Rice - another great meal\n- Coconut oil and spices\n- Avocado - for healthy fats\n- Bread - great for sandwiches"
  //     },
  //     {
  //         id: '8',
  //         title: 'Meeting startup',
  //         date: '09.24.21',
  //         content: "James begin the meeting with introduction with a warm welcome. Meeting everybody about the users who business. We are ready to know how much money we are missing big."
  //     }
  // ];

  const options = ["This week", "This month", "This year"];

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear().toString().slice(-2); // get last 2 digits
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} | ${hours}:${minutes}`;
  };

  const handleLongPress = (note) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => handleDelete(note._id), // Call the delete function
      },
    ]);
  };

  const handleDelete = async (noteId) => {
    try {
      // Call your delete API here
      await axios.delete(`${nodeBackend}/api/journal/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Toast.show({
        type: "success",
        text1: "Note deleted successfully",
        position: "top",
      });

      fetchNotes();
      // Optionally, update your state to remove the note from the UI
    } catch (error) {
      console.error("Error deleting note:", error);
      Toast.show({
        type: "error",
        text1: "Failed to delete note",
        position: "top",
      });
    }
  };

  const NoteCard = ({ note }) => {
    return (
      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>{note.title}</Text>
        <Text style={styles.noteDate}>{formatDate(note.date)}</Text>
        <Text style={styles.noteContent} numberOfLines={4}>
          {note.content}
        </Text>
      </View>
    );
  };

  const renderCategoryButton = (category) => {
    const isSelected = category === selectedCategory;
    return (
      <TouchableOpacity
        key={category}
        style={[
          styles.categoryButton,
          isSelected && { backgroundColor: "#8E67FD" },
        ]}
        onPress={() => setSelectedCategory(category)}
      >
        <Text style={[styles.categoryText, isSelected && { color: "white" }]}>
          {category}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.journalSection}>
        <Text style={styles.journalTitle}>Today's Reflection 📓</Text>
        <Text style={styles.journalSubtitle}>
          Write about your thoughts, feelings, and experiences
        </Text>
      </View>

      {/* <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                />
            </View> */}

      <View style={{ height: 60 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {options.map((category) => renderCategoryButton(category))}
        </ScrollView>
      </View>

      <ScrollView>
        <View style={styles.notesGrid}>
          {notes.map((note) => (
            <TouchableOpacity
              key={note._id}
              style={styles.noteCardContainer}
              onPress={() =>
                navigation.navigate("NoteScreen", {
                  isNewNote: false,
                  noteId: note._id,
                  title: note.title,
                  content: note.content,
                  date: formatDate(note.date),
                })
              }
              onLongPress={() => handleLongPress(note)}
            >
              <NoteCard note={note} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("NoteScreen", { isNewNote: true })}
      >
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  journalSection: {
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  journalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  journalSubtitle: {
    fontSize: 14,
    color: "#777",
  },
  searchContainer: {
    paddingHorizontal: 15,
    // paddingVertical: 10,
  },
  categoriesContainer: {
    // paddingVertical: 10,
    paddingHorizontal: 5,
    height: 50,
    alignItems: "center",
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 6,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  searchInput: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  notesGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
  },
  noteCardContainer: {
    width: "50%",
    padding: 8,
  },
  noteCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    height: 150,
    borderWidth: 0.1,
    borderColor: "#333",
  },
  noteTitle: {
    color: "#D473D4",
    fontWeight: "bold",
    marginBottom: 2,
    fontSize: 16,
  },
  noteDate: {
    color: "grey",
    fontSize: 12,
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    color: "#555",
  },
  addButton: {
    position: "absolute",
    right: 40,
    bottom: 40,
    backgroundColor: "#8E67FD",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default JournalList;
