import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doctorsData } from '../../../data/doctorsData';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import Constants from "expo-constants"

const DoctorProfileScreen = ({ route, navigation }) => {
  const { doctorId } = route.params;
  const [doctor, setDoctor] = useState(null);
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [selectedDay, setSelectedDay] = useState('Tue');
  const [selectedDate, setSelectedDate] = useState('12');
  const [selectedAppointmentType, setSelectedAppointmentType] = useState('Male');
  const pythonBackend = Constants.expoConfig.extra.pythonBackend
  

  useEffect(() => {
    const foundDoctor = doctorsData.find(doc => doc.id === doctorId);
    setDoctor(foundDoctor);
  }, [doctorId]);

  if (!doctor) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  const handleBook = async () => {
    try {
      const payload = `An appointment for ${selectedAppointmentType} has been requested on ${selectedDay}, ${selectedDate} at ${selectedTime}.`;

      const user_email = "farhaan8d@gmail.com";
      const psychologist_email = "fsfarhaanshaikh7@gmail.com";
      const session_details = payload;

      const response = await axios.post(`${pythonBackend}/request-session`, {
        user_email, psychologist_email, session_details
      });

      Toast.show({
        type: 'success', // 'success', 'error', 'info'
        text1: response.data.message || "Session request sent!",
        text2: 'Waiting for the approval from other side.',
      });

      // console.log(response);
      console.log(user_email, psychologist_email, session_details)

    } catch (err) {
      console.log(err);
    }
  }

  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '3:00 PM', '4:00 PM'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'];
  const dates = ['10', '11', '12', '13', '14'];
  const appointmentTypes = ['Male', 'Female', 'Child'];

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Appointment</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View> */}
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.profileHeader}>
            <Image 
              source={doctor.image} 
              style={styles.profileImage} 
            />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.specialization}>{doctor.specialization}</Text>
              <Text style={styles.college}>{doctor.designation}</Text>
              
              <View style={styles.contactButtons}>
                {/* <TouchableOpacity style={styles.contactButton}>
                  <Ionicons name="call" size={20} color="#8E67FD" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactButton}>
                  <Ionicons name="videocam" size={20} color="#8E67FD" />
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.contactButton}>
                  <Ionicons name="chatbubble" size={20} color="#8E67FD" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoValue}>{doctor.patients}</Text>
              <Text style={styles.infoLabel}>Patients</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoValue}>{doctor.experience}</Text>
              <Text style={styles.infoLabel}>Experience</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoValue}>{doctor.reviews}</Text>
              <Text style={styles.infoLabel}>Review</Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Working Hours</Text>
            <View style={styles.timeSlotContainer}>
              {timeSlots.map((time, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.timeSlot,
                    selectedTime === time && styles.timeSlotSelected
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.timeSlotTextSelected
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Schedules</Text>
            <View style={styles.calendarContainer}>
              {days.map((day, index) => (
                <View key={index} style={styles.dayColumn}>
                  <TouchableOpacity 
                    style={[
                      styles.dayItem,
                      selectedDay === day && styles.dayItemSelected
                    ]}
                    onPress={() => {
                      setSelectedDay(day);
                      setSelectedDate(dates[index]);
                    }}
                  >
                    <Text style={[
                      styles.dayText,
                      selectedDay === day && styles.dayTextSelected
                    ]}>
                      {day}
                    </Text>
                    <Text style={[
                      styles.dateText,
                      selectedDay === day && styles.dateTextSelected
                    ]}>
                      {dates[index]}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appointment For</Text>
            <View style={styles.appointmentTypeContainer}>
              {appointmentTypes.map((type, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.appointmentTypeButton,
                    selectedAppointmentType === type && styles.appointmentTypeSelected
                  ]}
                  onPress={() => setSelectedAppointmentType(type)}
                >
                  <Text style={[
                    styles.appointmentTypeText,
                    selectedAppointmentType === type && styles.appointmentTypeTextSelected
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.priceContainer}>
            <View>
              <Text style={styles.priceLabel}>Visit</Text>
              <Text style={styles.price}>$20</Text>
            </View>
            <TouchableOpacity onPress={handleBook} style={styles.bookButton}>
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  moreButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 7
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginRight: 15,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  specialization: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  college: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  contactButtons: {
    flexDirection: 'row',
  },
  contactButton: {
    marginRight: 12,
    backgroundColor: '#EDE7F6',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  timeSlotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeSlot: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 5,
    marginBottom: 10,
    backgroundColor: '#F0F0F0',
  },
  timeSlotSelected: {
    backgroundColor: '#8E67FD',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#666',
  },
  timeSlotTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayItem: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  dayItemSelected: {
    backgroundColor: '#8E67FD',
  },
  dayText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  dayTextSelected: {
    color: '#FFFFFF',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  dateTextSelected: {
    color: '#FFFFFF',
  },
  appointmentTypeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  appointmentTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#F0F0F0',
  },
  appointmentTypeSelected: {
    backgroundColor: '#8E67FD',
  },
  appointmentTypeText: {
    fontSize: 14,
    color: '#666',
  },
  appointmentTypeTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  priceContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  bookButton: {
    backgroundColor: '#8E67FD',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DoctorProfileScreen;