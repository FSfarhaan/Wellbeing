import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import profilepic from '../../assets/experts/profile.jpeg';
import { CommonActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfileScreen = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const navigation = useNavigation();

  const user = {
    name: 'Farhaan Shaikh',
    email: 'farhaan8d@gmail.com',
    phone: '+91 7021177410',
    profileImage: profilepic,
    upcomingAppointments: [
      { id: 1, doctor: 'Dr Bhoomi Singh', specialty: 'Psychologist', date: 'Mar 19, 2025', time: '10:00 AM' }
    ]
  };

  const handleLogOut = async () => {
    setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        })
      );
    }, 200)

    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('email');
    await AsyncStorage.removeItem('password');
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appointments':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            {user.upcomingAppointments.map(appointment => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <Text style={styles.doctorName}>{appointment.doctor}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Confirmed</Text>
                  </View>
                </View>
                <Text style={styles.specialtyText}>{appointment.specialty}</Text>
                <View style={styles.appointmentDetails}>
                  <View style={styles.detailItem}>
                    <Icon name="calendar" size={16} color="#6979F8" />
                    <Text style={styles.detailText}>{appointment.date}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Icon name="clock-outline" size={16} color="#6979F8" />
                    <Text style={styles.detailText}>{appointment.time}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        );
      case 'medical':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Records</Text>
            <TouchableOpacity style={styles.recordCard}>
              <Icon name="file-document-outline" size={24} color="#6979F8" />
              <View style={styles.recordInfo}>
                <Text style={styles.recordTitle}>Week 1 reports</Text>
                <Text style={styles.recordDate}>Feb 28, 2025</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#BDBDBD" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.recordCard}>
              <Icon name="file-document-outline" size={24} color="#6979F8" />
              <View style={styles.recordInfo}>
                <Text style={styles.recordTitle}>Week 2 reports</Text>
                <Text style={styles.recordDate}>Jan 15, 2025</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          </View>
        );
      case 'settings':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            <TouchableOpacity style={styles.settingItem}>
              <Icon name="account-outline" size={24} color="#6979F8" />
              <Text style={styles.settingText}>Edit Profile</Text>
              <Icon name="chevron-right" size={24} color="#BDBDBD" style={styles.settingArrow} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Icon name="bell-outline" size={24} color="#6979F8" />
              <Text style={styles.settingText}>Notifications</Text>
              <Icon name="chevron-right" size={24} color="#BDBDBD" style={styles.settingArrow} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Icon name="shield-check-outline" size={24} color="#6979F8" />
              <Text style={styles.settingText}>Privacy & Security</Text>
              <Icon name="chevron-right" size={24} color="#BDBDBD" style={styles.settingArrow} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Icon name="credit-card-outline" size={24} color="#6979F8" />
              <Text style={styles.settingText}>Payment Methods</Text>
              <Icon name="chevron-right" size={24} color="#BDBDBD" style={styles.settingArrow} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogOut} style={[styles.settingItem, styles.logoutItem]}>
              <Icon name="logout" size={24} color="#FF647C" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.profileSection}>
        <Image source={user.profileImage} style={styles.profileImage} />
        <Text style={styles.userName}>{user.name}</Text>
        <View style={styles.userInfo}>
          <View style={styles.infoItem}>
            <Icon name="email-outline" size={16} color="#6979F8" />
            <Text style={styles.infoText}>{user.email}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="phone-outline" size={16} color="#6979F8" />
            <Text style={styles.infoText}>{user.phone}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'appointments' && styles.activeTab]} 
          onPress={() => setActiveTab('appointments')}
        >
          <Text style={[styles.tabText, activeTab === 'appointments' && styles.activeTabText]}>Appointments</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'medical' && styles.activeTab]} 
          onPress={() => setActiveTab('medical')}
        >
          <Text style={[styles.tabText, activeTab === 'medical' && styles.activeTabText]}>Records</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]} 
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>Settings</Text>
        </TouchableOpacity>
      </View>
      
      {renderTabContent()}
      
      <View style={styles.bottomNavSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    padding: 20,
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: .1, 
    borderColor: "#333"
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    // marginHorizontal: 20,
    // marginTop: 20,
    borderRadius: 15,
    borderWidth: .1,
    borderColor: "#333"
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  userInfo: {
    // width: '100%',
    marginVertical: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    textAlign: "center"
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#8E67FD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginHorizontal: 20,
    borderWidth: .1,
    borderColor: "#333"
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6979F8',
  },
  tabText: {
    color: '#BDBDBD',
    fontWeight: '500',
    fontSize: 14,
  },
  activeTabText: {
    color: '#6979F8',
    fontWeight: '600',
  },
  tabContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: .1,
    borderColor: "#333"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  appointmentCard: {
    backgroundColor: '#F8F9FE',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    backgroundColor: '#E1F5EA',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    color: '#38C976',
    fontSize: 12,
    fontWeight: '500',
  },
  specialtyText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 10,
  },
  appointmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FE',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  recordInfo: {
    flex: 1,
    marginLeft: 15,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  recordDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    flex: 1,
  },
  settingArrow: {
    marginLeft: 'auto',
  },
  logoutItem: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF647C',
    marginLeft: 15,
  },
  bottomNavSpacer: {
    height: 80,
  },
});

export default UserProfileScreen;