import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";

const CommunityModal = ({ isVisible, onClose, community, onJoin }) => {
    const [image, setImage] = useState(null);
    useEffect(() => {
        if (community?.image) {
          console.log(community.image)
            const newImage =
                community.image === 44 ? require('../../assets/communities/family.jpg') :
                community.image === 45 ? require('../../assets/communities/selflove.jpg') :
                community.image === 46 ? require('../../assets/communities/relationship.jpg') :
                require('../../assets/communities/career.jpg');
    
            setImage(newImage);
        }
    }, [community?.image]);

  return (
    <Modal isVisible={isVisible} animationIn="slideInUp" animationOut="slideOutDown">
      <View style={styles.modalContainer}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close-circle" size={28} color="#ff5555" />
        </TouchableOpacity>

        {/* Community Image */}
        {image && <Image source={image} style={styles.communityImage} />}

        {/* Community Details */}
        <Text style={styles.title}>{community.title}</Text>
        <Text style={styles.description}>{community.description}</Text>
        <Text style={styles.members}>{community.members}</Text>

        {/* Join Button */}
        <TouchableOpacity style={styles.joinButton} onPress={() => onJoin(community.mId, community.title)}>
          <Text style={styles.joinText}>Join Community</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  communityImage: {
    width: 200,
    height: 200,
    borderRadius: 60,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 10,
  },
  members: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  joinButton: {
    backgroundColor: "#8E67FD",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  joinText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CommunityModal;
