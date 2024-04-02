import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateUserLocation } from "../api/gameAPI"; 
const SearchScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [keywords, setKeywords] = useState("");
  const [searchRadius, setSearchRadius] = useState(''); // State for user-defined search radius
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noResultsMessage, setNoResultsMessage] = useState('');

  useEffect(() => {
   (async () => {
     let { status } = await Location.requestForegroundPermissionsAsync();
     if (status !== "granted") {
       setErrorMsg("Permission to access location was denied");
       return;
     }

     let location = await Location.getCurrentPositionAsync({});
     setLocation(location);

     // Attempt to update the user's location in the backend
     try {
       const userId = await AsyncStorage.getItem('userId');
       if (userId && location) {
         await updateUserLocation(
           parseInt(userId),
           location.coords.latitude,
           location.coords.longitude
         );
         console.log("User location updated.");
       }
     } catch (error) {
       console.error("Failed to update user location:", error);
     }
   })();
 }, []);


 const DEFAULT_SEARCH_RADIUS = 5; // Default radius of 5 km

 // Helper function to calculate distance between two coordinates in kilometers
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
   var R = 6371; // Radius of the earth in km
   var dLat = deg2rad(lat2-lat1);  // deg2rad below
   var dLon = deg2rad(lon2-lon1); 
   var a = 
     Math.sin(dLat/2) * Math.sin(dLat/2) +
     Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
     Math.sin(dLon/2) * Math.sin(dLon/2)
     ; 
   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
   var d = R * c; // Distance in km
   return d;
 }
 
 function deg2rad(deg) {
   return deg * (Math.PI/180)
 }
 

  const searchItems = async () => {
    setIsLoading(true);

    const radius = searchRadius.trim() === '' ? DEFAULT_SEARCH_RADIUS : searchRadius;

    // Include the searchRadius in the API URL
    const apiURL = `http://192.168.1.78:8086/api/contents/search?keywords=${keywords}&latitude=${location?.coords?.latitude}&longitude=${location?.coords?.longitude}&searchRadius=${radius}`;
    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      if (data.length === 0) {
         setNoResultsMessage("Aucun résultat trouvé. Essayez d'utiliser d'autres mots-clés ou d'augmenter le rayon de recherche.");
       } else {
         // Calculate distance for each item and add it to the item
         const resultsWithDistance = data.map(item => {
           // Access the latitude and longitude from the balise object
           const distance = getDistanceFromLatLonInKm(
             location.coords.latitude, 
             location.coords.longitude, 
             item.balise.latitude, 
             item.balise.longitude
           );
           return { ...item, distance: distance.toFixed(2) }; // Keep only two decimal places
         });
         setResults(resultsWithDistance);
         setNoResultsMessage(''); // Clear the message if there are results
       }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCard = ({ item }) => (
   <TouchableOpacity
     style={styles.card}
     onPress={() => {
       navigation.navigate("ContentDetails", { contentId: item.id });
     }}
   >
     <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
     <View style={styles.cardContent}>
       <Text style={styles.cardTitle}>{item.title}</Text>
       <Text numberOfLines={2}>{item.body}</Text>
       <Text>{item.distance} km away</Text> 
     </View>
   </TouchableOpacity>
 );

 return (
  <View style={{ flex: 1, padding: 20 }}>
    <View style={styles.searchBar}>
      <TextInput
        placeholder="Enter keywords"
        value={keywords}
        onChangeText={setKeywords}
        style={styles.input}
      />
      <TextInput
        placeholder="Search radius (km)"
        value={searchRadius}
        onChangeText={setSearchRadius}
        keyboardType="numeric"
        style={styles.inputRadius} // Add a new style for this input
      />
      <TouchableOpacity onPress={searchItems} style={styles.searchButton}>
        <FontAwesome name="search" size={20} color="white" />
      </TouchableOpacity>
    </View>
    {isLoading ? (
      <ActivityIndicator size="large" color="#0000ff" />
    ) : results.length > 0 ? (
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
      />
    ) : noResultsMessage ? (
      <Text style={styles.noResultsMessage}>{noResultsMessage}</Text>
    ) : (
      <Text style={styles.noResultsText}>Entrez des mots-clés pour rechercher des éléments</Text>
    )}
  </View>
);

};

const styles = StyleSheet.create({
  searchBar: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, padding: 10, marginRight: 10, borderRadius: 5 },
  inputRadius: { // New style for the radius input
    width: 100,
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  searchButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  card: {
    flexDirection: "row",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "white",
  },
  cardImage: { width: 100, height: 100, borderRadius: 5 },
  cardContent: { flex: 1, padding: 10 },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  noResultsText: { textAlign: "center", marginTop: 50 },
});

export default SearchScreen;
