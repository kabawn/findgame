import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert, Text } from "react-native";

const BASE_URL = "http://192.168.1.78:8086"; // Ensure this matches your backend's base URL

const AddCategoryForm = ({ navigation }) => {
   const [categoryName, setCategoryName] = useState("");

   const handleSubmit = async () => {
      try {
         const response = await fetch(`${BASE_URL}/api/categories`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: categoryName }),
         });

         if (!response.ok) throw new Error("Failed to add category");
         Alert.alert("Success", "Category added successfully.");
         setCategoryName("");
         navigation.goBack(); // Optionally navigate back to the dashboard
      } catch (error) {
         console.error("Error adding category:", error);
         Alert.alert("Error", "Failed to add category.");
      }
   };

   return (
      <View style={styles.container}>
         <Text style={styles.label}>Category Name:</Text>
         <TextInput
            style={styles.input}
            placeholder="Enter category name"
            value={categoryName}
            onChangeText={setCategoryName}
         />
         <Button title="Submit Category" onPress={handleSubmit} />
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 20,
   },
   label: {
      fontSize: 16,
      marginBottom: 5,
   },
   input: {
      height: 40,
      borderColor: "gray",
      borderWidth: 1,
      marginBottom: 20,
      padding: 10,
   },
});

export default AddCategoryForm;
