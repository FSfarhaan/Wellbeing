import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";

const doctors = [
    { id: 1, name: "Dr. Remi Omotoso", location: "Magodo, Lagos", image: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 2, name: "Dr. Oyekunle Damilare", location: "Magodo, Lagos", image: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 3, name: "Dr. Obinna Idowu", location: "Magodo, Lagos", image: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 4, name: "Dr. Deborah Samuel", location: "Magodo, Lagos", image: "https://randomuser.me/api/portraits/women/2.jpg" },
    { id: 5, name: "Dr. Samuel Ade", location: "Ikeja, Lagos", image: "https://randomuser.me/api/portraits/men/3.jpg" },
];

const DoctorList = ({ onClose, handleSchedule }) => {

    const handleClick = (name) => {
        handleSchedule(name);
        onClose();
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>

            <Text style={styles.header}>Doctors List</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {doctors.map((doctor) => (
                    <View key={doctor.id} style={styles.card}>
                        <Image source={{ uri: doctor.image }} style={styles.image} />
                        <Text style={styles.name}>{doctor.name}</Text>
                        <Text style={styles.location}>{doctor.location}</Text>
                        <Text style={styles.rating}>⭐ (165) 4.5mile • Google</Text>
                        <TouchableOpacity style={styles.button}>
                            <Text onPress={() => handleClick(doctor.name)} style={styles.buttonText}>Schedule</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingBottom: 50,
        backgroundColor: "#fff",
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 20,
        zIndex: 10,
        padding: 10,
    },
    closeText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
    },
    card: {
        width: 200,
        padding: 15,
        marginRight: 15,
        backgroundColor: "#fff",
        borderRadius: 10,
        borderBlockColor: "333",
        borderWidth: .3,
        alignItems: "center",
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    location: {
        fontSize: 14,
        color: "gray",
        marginBottom: 5,
    },
    options: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 5,
    },
    option: {
        fontSize: 12,
        color: "#555",
    },
    rating: {
        fontSize: 12,
        color: "#555",
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#4FD1C5",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginBottom: 5,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#fff",
    },
    virtualButton: {
        backgroundColor: "#DFFFD8",
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    virtualText: {
        color: "green",
        fontSize: 12,
        fontWeight: "bold",
    },
});

export default DoctorList;
