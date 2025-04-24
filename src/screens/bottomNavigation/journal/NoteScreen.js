// screens/NoteScreen.js
import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Constants from "expo-constants";

const NoteScreen = ({ route, navigation }) => {
  const { isNewNote, noteId, title, content, date } = route.params || {};
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [token, setToken] = useState('');  
  const nodeBackend = Constants.expoConfig?.extra?.nodeBackend;

  useEffect(() => {
    const fetchToken = async () => {
      console.log("Run hua");
      const token = await AsyncStorage.getItem("token");
      if(token) setToken(token);
      console.log(token);
    }
    fetchToken();
  }, []);

  const showToast = (type, message) => {
      Toast.show({
        type: type, // 'success' | 'error' | 'info'
        text1: message,
        position: 'top',
        visibilityTime: 3000, // 3 seconds
      });
    };

  const handleSaveNote = async () => {
    console.log(token + "  " + noteTitle + "  " + noteContent);
    if (!token || !noteTitle || !noteContent) return;
  
    const note = {
      title: noteTitle,
      content: noteContent
    };

    console.log(noteId);
  
    const url = isNewNote 
      ? `${nodeBackend}/api/journal`  // Replace with your local IP
      : `${nodeBackend}/api/journal/${noteId}`;
  
    const method = isNewNote ? "post" : "put";
  
    try {
      const response = await axios({
        method,
        url,
        data: note,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log(response.data);
  
      showToast("success", isNewNote ? "Created Sucessfully" : "Updated Sucessfully");
  
      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 1, // Show JournalList (second in array)
            routes: [
              { name: 'Initial' },
              { name: 'JournalList' }
            ],
          })
        );
      }, 200);
  
    } catch (err) {
      console.error("Error saving note:", err.message);
      showToast("error", err.message);
    }
  };

  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity style={styles.bellButton} onPress={handleSaveNote}>
        <Ionicons name="checkmark" size={28} color="#8E67FD" />
      </TouchableOpacity>
    ),
  });
  

  useEffect(() => {
    if (noteId && !isNewNote) {
      if (title && content) {
        setNoteTitle(title);
        setNoteContent(content);
      }
    } 
  }, [navigation, token]);

  return (
    <SafeAreaView style={styles.container}>

      <View style={{ padding: 20, paddingBottom: 0 }}>
        <TextInput
          style={styles.titleInput}
          placeholder="Today’s Reflection"
          value={noteTitle}
          onChangeText={setNoteTitle}
          placeholderTextColor="#888"
        />
        <View style={{ height: .4, width: "100%", backgroundColor: "#333", marginBottom: date ? 5 : 0 }} />
        {date && <Text style={{ marginLeft: 5, color: "gray" }}>{date}</Text>}
      </View>

      <ScrollView style={styles.scrollView}>

        <TextInput
          style={styles.contentInput}
          placeholder="Your thoughts go here..."
          value={noteContent}
          onChangeText={setNoteContent}
          multiline
          placeholderTextColor="#888"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 20,
    paddingTop: 5
  },
  backButton: {
    marginLeft: 15,
  },
  bellButton: {
    marginRight: 15,
  },
  titleInput: {
    fontSize: 25,
    fontWeight: 'bold',
    // marginBottom: 16,
    color: '#333',
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    // flex: 1,
    // textAlignVertical: 'top',
  }
});

export default NoteScreen;