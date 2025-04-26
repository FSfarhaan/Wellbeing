import 'react-native-gesture-handler';

import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import ChatScreen from './src/screens/ChatScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack"
import { Ionicons } from '@expo/vector-icons';
import Dashboard from './src/screens/bottomNavigation/Dashboard';
import Explore from './src/screens/bottomNavigation/Explore';
import Experts from './src/screens/bottomNavigation/Experts';
import DoctorListScreen from './src/screens/bottomNavigation/experts/DoctorListScreen';
import DoctorProfileScreen from './src/screens/bottomNavigation/experts/DoctorProfileScreen';
import Mindful from './src/screens/bottomNavigation/Mindful';
import Reports from './src/screens/bottomNavigation/Reports';
import Profile from './src/screens/sideDrawer/Profile';
import Settings from './src/screens/sideDrawer/Settings';
import { NavigationContainer } from '@react-navigation/native';
import MusicPlayerScreen from './src/screens/bottomNavigation/sounds/MusicPlayer';
import MusicListScreen from './src/screens/bottomNavigation/sounds/MusicListScreen';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import VideoCallScreen from './src/utils/VideoCallScreen';
import UserProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/Login';
import Questionnaire from './src/screens/Questionnaire';
import CommunityChat from './src/screens/CommunityChat';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DailyTasks from './src/screens/DailyTasks';
import PatientListScreen from './src/screens/ExpertPortal/PatientsList'
import ProgressScreen from './src/screens/ExpertPortal/ProgressScreen';
import { getPushToken, setupNotificationHandlers } from './src/utils/Notifications';
import JournalList from './src/screens/bottomNavigation/journal/JournalList';
import NoteScreen from './src/screens/bottomNavigation/journal/NoteScreen';
import Constants from "expo-constants";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();



const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#4CAF50', backgroundColor: '#4CAF50' }} // Custom background & color
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#FF5252', backgroundColor: '#FF5252' }} // Darker theme
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
      }}
    />
  ),
};

// ✅ Bottom Tabs with Drawer Button in Header
function BottomTabs({ navigation }) {

  useEffect(()=> {
    async function setup() {
      setupNotificationHandlers();
      const nodeBackend = Constants.expoConfig?.extra?.nodeBackend;
      const token = await getPushToken();
      if (token) {
        const response = await axios.post(`${nodeBackend}/api/token/register`, { token });
        const data = response.data;
        console.log(data);
      }
    }
    setup();
  }, [])

  return (
    <View style={{ flex: 1 }}>
      {/* Bottom Tabs */}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            switch (route.name) {
              case "Dashboard":
                iconName = "home";
                break;
              case "Explore":
                iconName = "compass";
                break;
              case "Consult":
                iconName = "people";
                break;
              case "Mindful":
                iconName = "happy";
                break;
              case "Reports":
                iconName = "document-text";
                break;
              default:
                iconName = "ellipse";
                break;
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#8E67FD", // 🎨 Purplish shade for selected icon
          tabBarInactiveTintColor: "#ccc", // ⚪ Light gray for unselected icons
          tabBarStyle: {
            backgroundColor: "#fff", // ⚪ White background for the tab bar
            height: 70,
            // paddingBottom: 20,
            justifyContent: "center",
            alignItems: "center",
          },
          tabBarIconStyle: {
            marginTop: 5
          },
          tabBarLabelStyle: {
            fontSize: 12, // Reduce label size slightly
            fontWeight: "600", // Make labels slightly bolder
          },
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
              <View style={styles.profileButton}>
                <Ionicons name="person" size={20} color="white" />
              </View>
            </TouchableOpacity>
          ),
        })}
      >
        <Tab.Screen name="Dashboard" component={Dashboard}/>
        <Tab.Screen name="Explore" component={Explore}/>
        <Tab.Screen name="Consult" component={Experts}/>
        <Tab.Screen name="Mindful" component={Mindful}/>
        <Tab.Screen name="Reports" component={Reports} />
      </Tab.Navigator>
  
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("ChatScreen")}>
        <Ionicons name="chatbubble-ellipses-outline" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
  
}

function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Initial" component={BottomTabs} options={{ headerShown: false }} />
      <Stack.Screen name="MusicPlayer" component={MusicPlayerScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MusicList" component={MusicListScreen} options={{ title: "Explore Sounds" }} />
      <Stack.Screen name="Doctors List" component={DoctorListScreen} />
      <Stack.Screen name="Doctor Profile" component={DoctorProfileScreen} />
      <Stack.Screen name="liveCall" component={VideoCallScreen} options={{ title: "Live call" }}/>
      <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: "Chat Screen" }}/>
      <Stack.Screen name="ProfileScreen" component={UserProfileScreen} options={{ title: "Profile" }}/>
      <Stack.Screen name="Questionnaire" component={Questionnaire} options={{ headerShown: false }}/>
      <Stack.Screen name="CommunityChat" component={CommunityChat} options={{ title: "Commmunity" }} />
      <Stack.Screen name="DailyTasks" component={DailyTasks} options={{ title: "Daily Tasks" }} />
      <Stack.Screen name="PatientsList" component={PatientListScreen} options={{ title: "Patients List" }} />
      <Stack.Screen name="ProgressScreen" component={ProgressScreen} options={{ title: "Progress" }} />
      <Stack.Screen name="JournalList" component={JournalList} options={{ title: "Journal" }} />
      <Stack.Screen name="NoteScreen" component={NoteScreen} options={{ title: "Create Note" }} />
    </Stack.Navigator>
  );
}

// const ExpertStack = () => {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Expert" component={Experts} />
//     </Stack.Navigator>
//   );
// };

export default function App() {
  return (
      <NavigationContainer>
        <StackNavigator />
        <Toast config={toastConfig} />
      </NavigationContainer>
      // <ChatScreen />
      // <Questionnaire />
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 70,
    right: 20,
    backgroundColor: "#4B0082", 
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // Shadow on Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFB6C1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  profileButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3F414E',
  },
});
