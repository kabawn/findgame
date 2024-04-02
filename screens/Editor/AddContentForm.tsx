import React, { useState, useEffect } from "react";
import {
   View,
   TextInput,
   Button,
   StyleSheet,
   Alert,
   Text,
   ScrollView,
   Image,
   TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { propertyKeyToLabel } from "../utils"; // Assuming you have this utility function

const BASE_URL = "http://192.168.1.78:8086";

const AddContentForm = () => {
   const [formData, setFormData] = useState({
      categoryId: "",
      baliseId: "",
      title: "",
      body: "",
      properties: {},
      imageUrl: "", // Add this line
      keywords: [], // Initialize as empty array for input handling
      searchRadius: "", // Add searchRadius here
   });
   const [categories, setCategories] = useState([]);
   const [balises, setBalises] = useState([]);
   const [userId, setUserId] = useState("");
   const [imageUri, setImageUri] = useState(null);
   const [rawKeywords, setRawKeywords] = useState("");

   useEffect(() => {
      getUserIdAndFetchData();
   }, []);

   const getUserIdAndFetchData = async () => {
      try {
         const storedUserId = await AsyncStorage.getItem("userId");
         setUserId(storedUserId);
         fetchCategories();
         if (storedUserId) fetchBalises(storedUserId);
      } catch (error) {
         console.error("Error fetching user data:", error);
      }
   };

   const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
      });

      if (!result.canceled) {
         setImageUri(result.assets[0].uri);
      }
   };

   // Image upload function
   const uploadImage = async (imageUri) => {
      let formData = new FormData();
      formData.append("file", {
         uri: imageUri,
         type: "image/jpeg", // Adjust based on actual image type
         name: "upload.jpg", // The name can be dynamically set if needed
      });

      try {
         const response = await fetch(`${BASE_URL}/api/upload`, {
            method: "POST",
            body: formData,
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });

         if (!response.ok) throw new Error("Failed to upload image");

         // Directly use the response URL as it already includes the base URL
         const imageUrl = await response.text();

         // Update formData with the received image URL
         setFormData((prevState) => ({
            ...prevState,
            imageUrl: imageUrl.trim(), // Ensuring no leading/trailing whitespace
         }));

         return imageUrl; // This return might be used or ignored depending on subsequent logic
      } catch (error) {
         console.error("Error uploading image:", error);
         Alert.alert("Error", "Failed to upload image.");
         return null; // Indicating failure
      }
   };

   const fetchCategories = async () => {
      try {
         const response = await fetch(`${BASE_URL}/api/categories`);
         if (!response.ok) throw new Error("Failed to fetch categories");
         const data = await response.json();
         setCategories(data);
      } catch (error) {
         console.error("Error fetching categories:", error);
         Alert.alert("Error", "Failed to fetch categories.");
      }
   };

   const fetchBalises = async (userId) => {
      try {
         const response = await fetch(`${BASE_URL}/api/balises/user/${userId}`);
         if (!response.ok) throw new Error("Failed to fetch Balises");
         const data = await response.json();
         setBalises(data);
      } catch (error) {
         console.error("Error fetching Balises:", error);
         Alert.alert("Error", "Failed to fetch Balises.");
      }
   };

   const handleChange = (name, value) => {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
   };

   const handlePropertyChange = (property, value) => {
      setFormData((prevState) => ({
         ...prevState,
         properties: { ...prevState.properties, [property]: value },
      }));
   };

   // Define getCategoryNameById function
   const getCategoryNameById = (categoryId) => {
      const category = categories.find((cat) => cat.id.toString() === categoryId);
      return category ? category.name : "";
   };

   // Submit content function
   const handleSubmit = async () => {
      if (!formData.title || !formData.body || !formData.categoryId || !formData.baliseId) {
         Alert.alert("Validation Error", "Please fill in all fields.");
         return;
      }

      if (!imageUri) {
         Alert.alert("Validation Error", "Please pick an image.");
         return;
      }

      // Upload image and get the URL
      const imageUrl = await uploadImage(imageUri);
      if (!imageUrl) {
         Alert.alert("Upload Error", "Failed to upload image.");
         return;
      }

      const keywordsArray = rawKeywords
         .split(",")
         .map((kw) => kw.trim())
         .filter((kw) => kw);

      // Adjust properties to start with a capital letter
      const adjustedProperties = Object.keys(formData.properties).reduce((acc, key) => {
         const formattedKey = propertyKeyToLabel(key); // Convert key to a readable format
         acc[formattedKey] = formData.properties[key];
         return acc;
      }, {});

      // Prepare submission data including the imageUrl
      const submissionData = {
         ...formData,
         userId: userId,
         imageUrl: imageUrl, // Include the image URL received from the upload function
         keywords: keywordsArray,
         properties: adjustedProperties,
         searchRadius: parseFloat(formData.searchRadius), // Make sure it's a number
      };

      try {
         const response = await fetch(`${BASE_URL}/api/contents`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(submissionData),
         });

         if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Failed to submit content: ${errorData}`);
         }

         Alert.alert("Success", "Content added successfully!");
         // Reset form fields here
      } catch (error) {
         console.error("Error submitting content:", error);
         Alert.alert("Error", "Failed to submit content.");
      }
   };

   return (
      <ScrollView style={styles.container}>
         <Text>Category:</Text>
         <Picker
            selectedValue={formData.categoryId}
            onValueChange={(itemValue) => handleChange("categoryId", itemValue)}
         >
            {categories.map((category) => (
               <Picker.Item
                  key={category.id}
                  label={category.name}
                  value={category.id.toString()}
               />
            ))}
         </Picker>
         {/* Balise Picker */}
         <Text>Balise:</Text>
         <Picker
            selectedValue={formData.baliseId}
            onValueChange={(itemValue) => handleChange("baliseId", itemValue)}
         >
            {balises.map((balise) => (
               <Picker.Item
                  key={balise.id}
                  label={balise.name || `Balise ${balise.id}`}
                  value={balise.id.toString()}
               />
            ))}
         </Picker>
         {/* Formulaire de compétences */}
         {getCategoryNameById(formData.categoryId) === "Skills" && (
            <>
               <Text>Titre :</Text>
               <TextInput
                  placeholder="Entrez le titre"
                  value={formData.title}
                  onChangeText={(text) => handleChange("title", text)}
                  style={styles.input}
               />
               <Text>Description :</Text>
               <TextInput
                  placeholder="Entrez la description du service"
                  value={formData.body}
                  multiline
                  numberOfLines={8}
                  onChangeText={(text) => handleChange("body", text)}
                  style={[styles.input, { textAlignVertical: "top" }]}
               />

               <TextInput
                  placeholder="Années d'expérience"
                  value={formData.properties.yearsOfExperience || ""}
                  onChangeText={(text) => handlePropertyChange("yearsOfExperience", text)}
                  style={styles.input}
               />
               <TextInput
                  placeholder="Email"
                  value={formData.properties.email || ""}
                  onChangeText={(text) => handlePropertyChange("email", text)}
                  style={styles.input}
               />
               <TextInput
                  placeholder="Téléphone"
                  value={formData.properties.phone || ""}
                  onChangeText={(text) => handlePropertyChange("phone", text)}
                  style={styles.input}
               />
               <TextInput
                  placeholder="Langues parlées (séparées par une virgule)"
                  value={formData.properties.languages || ""}
                  onChangeText={(text) => handlePropertyChange("languages", text)}
                  style={styles.input}
               />
               <TextInput
                  placeholder="Disponibilité (jours et heures)"
                  value={formData.properties.availability || ""}
                  onChangeText={(text) => handlePropertyChange("availability", text)}
                  style={styles.input}
               />

               <TextInput
                  placeholder="Entrez les mots-clés (séparés par une virgule)"
                  value={rawKeywords}
                  onChangeText={setRawKeywords} // Update rawKeywords directly
                  style={styles.input}
               />
               <TextInput
                  placeholder="Search Radius (in kilometers)"
                  value={formData.searchRadius.toString()} // Convert searchRadius to string for the input
                  onChangeText={(text) => setFormData({ ...formData, searchRadius: text })}
                  keyboardType="numeric" // Ensure numeric keyboard for better user experience
                  style={styles.input}
               />
               {/* Sélecteur et aperçu d'image */}
               <Button title="Choisir une image" onPress={pickImage} />
               {imageUri && (
                  <View style={{ alignItems: "center", marginVertical: 20 }}>
                     <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
                  </View>
               )}
            </>
         )}

         {/* Services Form */}
         {getCategoryNameById(formData.categoryId) === "Services" && (
            <>
               <TextInput
                  placeholder="Service Type"
                  value={formData.properties.serviceType || ""}
                  onChangeText={(text) => handlePropertyChange("serviceType", text)}
                  style={styles.input}
               />
               <TextInput
                  placeholder="Service Description"
                  value={formData.properties.serviceDescription || ""}
                  onChangeText={(text) => handlePropertyChange("serviceDescription", text)}
                  style={styles.input}
               />
            </>
         )}
         <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit Content</Text>
         </TouchableOpacity>
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 20,
   },
   input: {
      borderWidth: 1,
      borderColor: "#ced4da", // Bootstrap-like input border color
      marginBottom: 10,
      padding: 10,
      borderRadius: 5,
      fontSize: 16,
   },
   submitButton: {
      backgroundColor: "#007bff", // Bootstrap primary button color
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      marginTop: 20,
      marginBottom: 50,
   },
   submitButtonText: {
      color: "#ffffff",
      fontSize: 16,
   },
});

export default AddContentForm;
