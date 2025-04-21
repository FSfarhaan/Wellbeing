import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DoctorCard from '../../components/DoctorCard'
import { doctorsData } from '../../data/doctorsData';


const Experts = ({ navigation }) => {
  // Filter popular doctors
  const popularDoctors = doctorsData.filter(doctor => doctor.isPopular);
  const emergencyContacts = [
    {
      name: 'Kiran Mental Health',
      number: '1800-599-0019',
      availability: '24/7',
      type: 'Government'
    },
    {
      name: 'Tele-MANAS',
      number: '14416',
      availability: '24/7',
      type: 'Government'
    },
    {
      name: 'AASRA',
      number: '+91 98204 66726',
      availability: '24/7',
      type: 'NGO'
    },
    {
      name: 'Samaritans Mumbai',
      number: '+91 84229 84528',
      availability: '3 PM – 9 PM, all days',
      type: 'NGO'
    },
    {
      name: 'Vandrevala Foundation',
      number: '+91 99996 66555',
      availability: '24/7',
      type: 'NGO'
    },
    {
      name: 'iCall (TISS)',
      number: '+91 9152987821',
      availability: 'Mon–Sat, 10 AM – 8 PM',
      type: 'NGO'
    },
    {
      name: 'CHILDLINE India',
      number: '1098',
      availability: '24/7',
      type: 'Child Helpline'
    }
  ];
  
  const makeCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  const getColorByType = (type) => {
    switch (type) {
      case 'Government':
        return '#FFF0F0';
        case 'NGO':
          return '#E6F0FF';
      case 'Child Helpline':
        return '#F0FFF0';
      default:
        return '#F5F5F5';
    }
  };

  const renderEmergencyButton = (contact, index) => {
    return (
      <View key={index} style={[styles.card, { backgroundColor: getColorByType(contact.type) }]}>
          <View style={styles.cardHeader}>
            <Ionicons
              name={contact.type === 'Government' ? 'shield-checkmark' : contact.type === 'Child Helpline' ? 'happy' : 'people'}
              size={22}
              color="#555"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.title}>{contact.name}</Text>
          </View>
          <Text style={styles.details}>📞 {contact.number}</Text>
          <Text style={styles.details}>🕒 {contact.availability}</Text>
          <Text style={styles.details}>{contact.type}</Text>
          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:${contact.number}`)}
            style={styles.callBtn}
          >
            <Ionicons name="call" size={18} color="white" />
            <Text style={styles.callText}>Call</Text>
          </TouchableOpacity>
        </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>You're in Safe Hands ❤️‍🩹</Text>
          <Text style={styles.subGreetingText}>Trusted experts, ready to help.</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search doctor, health issue, etc."
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
          </View>

          <View style={styles.categoriesContainer}>
            <TouchableOpacity style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: '#FFE6E6' }]}>
                <Ionicons name="heart-circle" size={24} color="#FF4C4C" />
              </View>
              <Text style={styles.categoryText}>Relationship</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: '#FFF5E6' }]}>
                <Ionicons name="people" size={24} color="#FF8C1A" />
              </View>
              <Text style={styles.categoryText}>Childhood</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: '#E6F0FF' }]}>
                <Ionicons name="sad-outline" size={24} color="#4C74FF" />
              </View>
              <Text style={styles.categoryText}>Depression</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: '#E6FFF0' }]}>
                <Ionicons name="medical" size={24} color="#1ABC9C" />
              </View>
              <Text style={styles.categoryText}>Addiction</Text>
            </TouchableOpacity>
          </View>

        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Doctors</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Doctors List')}
            >
              <Text style={styles.seeAllText}>Show All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.doctorsScrollView}
          >
            {popularDoctors.map(doctor => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onPress={() => navigation.navigate('Doctor Profile', { doctorId: doctor.id })}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {emergencyContacts.map((contact, index) => renderEmergencyButton(contact, index))}
          </ScrollView>

        </View>

        {/* <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Appointments')}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.appointmentCard}>
            <View style={styles.appointmentInfo}>
              <Text style={styles.appointmentDate}>Mar 14, 2025 • 10:00 AM</Text>
              <Text style={styles.appointmentDoctor}>Dr. Bhoomi Singh</Text>
              <Text style={styles.appointmentSpecialty}>Ph.D. in Neuropsychiatry</Text>
            </View>
            <View style={styles.appointmentActions}>
              <TouchableOpacity onPress={() => navigation.navigate('liveCall')} style={[styles.appointmentButton, styles.rescheduleButton]}>
                <Text style={styles.rescheduleText}>Start meeting</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.appointmentButton, styles.cancelButton]}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: 25,
  },
  greetingContainer: {
    // marginTop: 25,
    paddingHorizontal: 20,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3F414E',
  },
  subGreetingText: {
    fontSize: 16,
    color: '#A1A4B2',
    marginTop: 5,
    marginBottom: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: .1,
    borderColor: "#333"
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#6C63FF',
  },
  doctorsScrollView: {
    paddingLeft: 20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 6,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryItem: {
    alignItems: 'center',
    width: '22%',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    width: 220,
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    flexShrink: 1,
    color: '#333',
  },
  details: {
    fontSize: 13,
    marginTop: 2,
    color: '#555',
  },
  callBtn: {
    marginTop: 10,
    backgroundColor: '#FF4C4C',
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  callText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  appointmentCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    borderWidth: .1,
    borderColor: "#333"
  },
  appointmentInfo: {
    marginBottom: 15,
  },
  appointmentDate: {
    fontSize: 14,
    color: '#6C63FF',
    marginBottom: 5,
  },
  appointmentDoctor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  appointmentSpecialty: {
    fontSize: 14,
    color: '#666',
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appointmentButton: {
    width: '48%',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  rescheduleButton: {
    backgroundColor: '#EDE7F6',
  },
  rescheduleText: {
    color: '#7E57C2',
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#FFF2F2',
  },
  cancelText: {
    color: '#FF4B4B',
    fontWeight: '500',
  },
});

export default Experts;