import React from "react";
import { Modal, View, Text, Image, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { AntDesign } from "@expo/vector-icons"; // for icons
import TreasureBox from "./TreasureBox"; // Import the new component
import { Linking } from "react-native";

const LocationDetailsModal = ({ location, isVisible, onClose }) => {
   const scaleValue = React.useRef(new Animated.Value(0)).current;

   React.useEffect(() => {
      if (isVisible) {
         Animated.spring(scaleValue, {
            toValue: 1,
            velocity: 3,
            tension: 2,
            friction: 8,
            useNativeDriver: true,
         }).start();
      } else {
         scaleValue.setValue(0);
      }
   }, [isVisible]);

   if (!location) return null;

   return (
      <Modal animationType="fade" transparent={true} visible={isVisible} onRequestClose={onClose}>
         <View style={styles.centeredView}>
            <Animated.View style={[styles.modalView, { transform: [{ scale: scaleValue }] }]}>
               {/* Image with shimmer effect */}
               <Image source={{ uri: location.imageUrl }} style={styles.image} />
               <Text style={styles.title}>{location.name}</Text>
               <Text style={styles.description}>{location.description}</Text>
               {/* Additional details */}
               <Text style={styles.detail}>
                  Website:
                  <Text style={styles.link} onPress={() => Linking.openURL(location.websiteUrl)}>
                     {location.websiteUrl}
                  </Text>
               </Text>
               {/* Treasure Box Component */}
               <TreasureBox promoInfo={location.promoInfo} />
               {/* Interactive buttons */}
               <TouchableOpacity style={styles.interactionButton}>
                  <AntDesign name="checkcircleo" size={24} color="green" />
                  <Text style={styles.interactionButtonText}>Check-in</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Text style={styles.closeButtonText}>Close</Text>
               </TouchableOpacity>
            </Animated.View>
         </View>
      </Modal>
   );
};

const styles = StyleSheet.create({
   centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
   },
   modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
   },
   image: {
      width: 300,
      height: 200,
      borderRadius: 10,
      marginBottom: 15,
   },
   title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 5,
   },
   description: {
      fontSize: 16,
      color: "gray",
      textAlign: "center",
      marginBottom: 10,
   },
   detail: {
      fontSize: 14,
      color: "#333",
      marginBottom: 5,
   },
   closeButton: {
      backgroundColor: "#2196F3",
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      marginTop: 15,
   },
   closeButtonText: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
   },
   interactionButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      padding: 10,
      borderRadius: 20,
      marginTop: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
   },
   interactionButtonText: {
      marginLeft: 5,
      color: "#333",
      fontSize: 16,
   },
   link: {
    color: '#0645AD', // You can choose any color
    textDecorationLine: 'underline', // Underline for link
},
});

export default LocationDetailsModal;
