import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Image, ScrollView } from "react-native";
import { fetchGameLocations } from "..//..//api/gameAPI"; // Assuming the correct import path
import { MaterialIcons } from "@expo/vector-icons";

const EditorDashboard = ({ navigation }) => {
   const [locationCount, setLocationCount] = useState(0);

   useEffect(() => {
      const fetchLocations = async () => {
         try {
            const locations = await fetchGameLocations();
            setLocationCount(locations.length);
         } catch (error) {
            console.error("Error fetching locations:", error);
         }
      };
      fetchLocations();
   }, []);

   return (
      <ScrollView style={styles.scrollContainer}>
         <View style={styles.container}>
            <Text style={styles.header}>Editor Dashboard</Text>
            <View style={styles.card}>
               <Image source={require("..//..//assets/man.jpg")} style={styles.profileImage} />
               <Text style={styles.locationCount}>Locations Added: {locationCount}</Text>
               {/* <Button
                  title="Add New Location"
                  onPress={() => navigation.navigate("AddLocationForm")}
                  icon={<MaterialIcons name="add-location-alt" size={24} color="white" />}
               /> */}

               <Button
                  title="Add New Balise"
                  onPress={() => navigation.navigate("AddBaliseScreen")}
                  color="#3629B7" // Update this to match your app's theme
               />

               <Button
                  title="Add New Category"
                  onPress={() => navigation.navigate("AddCategoryForm")}
               />

               <Button title="Add Content" onPress={() => navigation.navigate("AddContentForm")} />
            </View>
         </View>
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   scrollContainer: {
      flex: 1,
      backgroundColor: "#3629B7",
   },
   container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
   },
   header: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      color: "white",
   },
   card: {
      backgroundColor: "white",
      borderRadius: 10,
      padding: 100,
      alignItems: "center",
      marginBottom: 20,
   },
   profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
   },
   locationCount: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 10,
   },
});

export default EditorDashboard;
