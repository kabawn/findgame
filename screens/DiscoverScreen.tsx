import React, { useState, useEffect } from "react";
import { View, StyleSheet, Animated, Text } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
   fetchDiscoverableGameLocationsForUser,
   fetchUserData,
   updateUserLocation,
   updateUserSearchRadius,
} from "../api/gameAPI";
import Slider from "@react-native-community/slider";
import LocationDetailsModal from "./LocationDetailsModal"; // Import the modal component

const DiscoverScreen = () => {
   const [location, setLocation] = useState(null);
   const [items, setItems] = useState([]);
   const [fillOpacity] = useState(new Animated.Value(0.3));
   const [userSearchRadius, setUserSearchRadius] = useState(null);
   const [sliderValue, setSliderValue] = useState(1); // Default radius
   const [selectedLocation, setSelectedLocation] = useState(null);
   const [modalVisible, setModalVisible] = useState(false);
   const getUserIdFromStorage = async () => {
      const id = await AsyncStorage.getItem("userId");

      return id ? parseInt(id) : null;
   };

   // Separate function to fetch game locations
   const loadGameLocations = async (userId) => {
      try {
         const gameLocations = await fetchDiscoverableGameLocationsForUser(userId);
         console.log("Fetched Game Locations:", gameLocations);
         setItems(Array.isArray(gameLocations) ? gameLocations : []);
      } catch (error) {
         console.error("Error fetching game locations:", error.message);
         setItems([]); // Set items to an empty array in case of error
      }
   };

   // Function to handle marker press
   const handleMarkerPress = (item) => {
      setSelectedLocation(item);
      setModalVisible(true);
   };

   const handleSliderChange = async (value) => {
      setSliderValue(value);
      setUserSearchRadius(value * 1000); // Convert km to meters for the map

      const userId = await getUserIdFromStorage();
      if (userId) {
         try {
            await updateUserSearchRadius(userId, value);
            console.log("User search radius updated to:", value);
            await loadGameLocations(userId); // Re-fetch game locations with new radius
         } catch (error) {
            console.error("Error updating user search radius:", error);
         }
      }
   };

   useEffect(() => {
      (async () => {
         const userIdFromStorage = await getUserIdFromStorage();
         if (!userIdFromStorage) {
            console.error("User ID not found in storage.");
            return;
         }

         let { status } = await Location.requestForegroundPermissionsAsync();
         if (status !== "granted") {
            alert("Permission to access location was denied");
            return;
         }

         const currentLocation = await Location.getCurrentPositionAsync({});
         console.log("Current Location:", currentLocation.coords);

         setLocation(currentLocation.coords);

         try {
            await updateUserLocation(
               userIdFromStorage,
               currentLocation.coords.latitude,
               currentLocation.coords.longitude
            );
            console.log("Updated User Location");
         } catch (error) {
            console.error("Error updating user location:", error.message);
         }

         try {
            const gameLocations = await fetchDiscoverableGameLocationsForUser(userIdFromStorage);
            console.log("Fetched Game Locations:", gameLocations);

            setItems(Array.isArray(gameLocations) ? gameLocations : []);
         } catch (error) {
            console.error("Error fetching game locations:", error.message);
            setItems([]); // Set items to an empty array in case of error
         }

         try {
            const userData = await fetchUserData(userIdFromStorage);
            console.log("Fetched User Data:", userData);

            setUserSearchRadius(userData.searchRadius * 1000); // Convert from km to meters
         } catch (error) {
            console.error("Error fetching user data:", error.message);
         }
         await loadGameLocations(userIdFromStorage); // Fetch game locations initially
      })();

      Animated.loop(
         Animated.sequence([
            Animated.timing(fillOpacity, {
               toValue: 0.6,
               duration: 1000,
               useNativeDriver: true,
            }),
            Animated.timing(fillOpacity, {
               toValue: 0.3,
               duration: 1000,
               useNativeDriver: true,
            }),
         ])
      ).start();
   }, []);

   return (
      <View style={styles.container}>
         <View style={styles.card}>
            <Text style={styles.Searching}>Searching....</Text>
            {location && (
               <MapView
                  style={styles.map}
                  initialRegion={{
                     latitude: location.latitude,
                     longitude: location.longitude,
                     latitudeDelta: 0.0922,
                     longitudeDelta: 0.0421,
                  }}
               >
                  <Marker coordinate={location} title="Your Location" />
                  {items.map((item) => (
                     <Marker
                        key={item.id}
                        coordinate={{ latitude: item.latitude, longitude: item.longitude }}
                        title={item.name}
                        onPress={() => handleMarkerPress(item)}
                     />
                  ))}

                  <Animated.View style={{ opacity: fillOpacity }}>
                     <Circle
                        center={location}
                        radius={userSearchRadius}
                        strokeWidth={1}
                        strokeColor={"#3399ff"}
                        fillColor={"rgba(51,153,255,0.3)"}
                     />
                  </Animated.View>

                  {Array.isArray(items) &&
                     items.map((item) => (
                        <React.Fragment key={item.id}>
                           <Marker
                              coordinate={{ latitude: item.latitude, longitude: item.longitude }}
                              title={item.htmlContent}
                           />
                           <Circle
                              center={{ latitude: item.latitude, longitude: item.longitude }}
                              radius={item.visibilityRadius * 1000} // Convert from km to meters
                              strokeWidth={1}
                              strokeColor={"#0066cc"}
                              fillColor={"rgba(0,102,204,0.5)"}
                           />
                        </React.Fragment>
                     ))}
               </MapView>
            )}
         </View>
         <View style={styles.sliderContainer}>
            <Slider
               style={styles.slider}
               minimumValue={1}
               maximumValue={10}
               step={1}
               value={sliderValue}
               onValueChange={handleSliderChange}
               minimumTrackTintColor="#3399ff"
               maximumTrackTintColor="#000000"
            />
            <Text style={styles.sliderValueText}>{`${sliderValue} km`}</Text>
         </View>
         <LocationDetailsModal
            location={selectedLocation}
            isVisible={modalVisible}
            onClose={() => setModalVisible(false)}
         />
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#3629B7", // Top part color
   },
   card: {
      marginTop: 20, // Adjust as necessary for your design
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      padding: 10,
      marginHorizontal: 1,
      alignItems: "center",
      width: 390,
      height: 610,
      // Add shadow styles for card if needed
   },
   map: {
      width: "100%",
      height: "90%",
   },
   Searching: {
      fontSize: 22,
      fontWeight: "bold",
      marginVertical: 10,
   },
   sliderContainer: {
      alignItems: "stretch",
      justifyContent: "center",
      padding: 20,
   },
   slider: {
      width: "100%",
      height: 20, // Adjust the height as needed
   },
   sliderValueText: {
      textAlign: "center",
      color: "#ffff",
      marginVertical: 10, // Adjust the margin as needed
   },
});

export default DiscoverScreen;
