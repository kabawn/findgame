import React, { useEffect, useState } from "react";
import {
   View,
   Text,
   Image,
   StyleSheet,
   ScrollView,
   ActivityIndicator,
   TouchableOpacity,
   Linking,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { propertyKeyToLabel } from "./utils"; // Assuming you have this utility function

const ContentDetailsScreen = ({ route }) => {
   const { contentId } = route.params;
   const [contentDetails, setContentDetails] = useState(null);
   const [userInfo, setUserInfo] = useState(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      async function fetchContentAndUserDetails() {
         try {
            const contentResponse = await fetch(
               `http://192.168.1.78:8086/api/contents/${contentId}`
            );
            const contentData = await contentResponse.json();
            setContentDetails(contentData);

            const baliseResponse = await fetch(
               `http://192.168.1.78:8086/api/balises/${contentData.baliseId}`
            );
            const baliseData = await baliseResponse.json();

            const userResponse = await fetch(`http://192.168.1.78:8086/users/${baliseData.userId}`);
            const userData = await userResponse.json();
            setUserInfo(userData);
         } catch (error) {
            console.error("Failed to fetch content or user details:", error);
         } finally {
            setIsLoading(false);
         }
      }

      fetchContentAndUserDetails();
   }, [contentId]);

   const makeCall = (phoneNumber) => {
      Linking.openURL(`tel:${phoneNumber}`);
   };

   if (isLoading) {
      return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
   }

   return (
      <ScrollView style={styles.container}>
         {contentDetails && (
            <>
               <Image source={{ uri: contentDetails.imageUrl }} style={styles.image} />
               <Text style={styles.title}>{contentDetails.title}</Text>
               <Text style={styles.body}>{contentDetails.body}</Text>
               <View style={styles.details}>
                  <Text style={styles.detailsTitle}>Détails du service :</Text>
                  {contentDetails.properties &&
                     Object.entries(contentDetails.properties).map(([key, value], index) => (
                        // Use the utility function to convert property keys to labels
                        <Text key={index} style={styles.detailItem}>{`${propertyKeyToLabel(
                           key
                        )}: ${value}`}</Text>
                     ))}
               </View>
               {userInfo && (
                  <View style={styles.userInfo}>
                     <Text style={styles.userInfoTitle}>Informations sur l'éditeur :</Text>
                     <Text style={styles.info}>
                        <MaterialIcons name="person" size={16} />{" "}
                        {`${userInfo.firstName} ${userInfo.lastName}`}
                     </Text>
                     <Text style={styles.info}>
                        <MaterialIcons name="email" size={16} /> {userInfo.email}
                     </Text>
                     <TouchableOpacity
                        style={styles.button}
                        onPress={() => makeCall(contentDetails.properties.phone)}
                     >
                        <MaterialIcons name="phone" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Appeler</Text>
                     </TouchableOpacity>
                  </View>
               )}
            </>
         )}
      </ScrollView>
   );
};
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
   },
   image: {
      width: "100%",
      height: 250,
      resizeMode: "cover",
   },
   title: {
      fontSize: 22,
      fontWeight: "bold",
      marginTop: 10,
      marginHorizontal: 15,
   },
   body: {
      fontSize: 16,
      color: "#666",
      margin: 15,
   },
   details: {
      marginHorizontal: 15,
   },
   detailsTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 5,
   },
   detailItem: {
      fontSize: 16,
      marginBottom: 5,
   },
   userInfo: {
      marginTop: 20,
      marginHorizontal: 15,
   },
   userInfoTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
   },
   info: {
      fontSize: 16,
      marginBottom: 5,
      flexDirection: "row",
      alignItems: "center",
   },
   button: {
      backgroundColor: "#007BFF",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
   },
   buttonText: {
      color: "#fff",
      marginLeft: 5,
      fontSize: 16,
   },
   loader: {
      marginTop: 20,
   },
});

export default ContentDetailsScreen;
