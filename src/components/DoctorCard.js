import React from 'react';
import { Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const DoctorCard = ({ doctor, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image 
        source={doctor.image} 
        style={styles.image}
      />
      <Text style={styles.name}>{doctor.name}</Text>
      <Text style={styles.specialization}>{doctor.specialization}</Text>
      <Text style={styles.college}>{doctor.college}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
    borderWidth: .1,
    borderColor: "#333"
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  specialization: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 3,
  },
  college: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});

export default DoctorCard;