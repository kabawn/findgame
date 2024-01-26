import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addGameLocation } from '..//..//api/gameAPI';

const AddLocationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        websiteUrl: '',
        imageUrl: '',
        promoInfo: '',
        latitude: '',
        longitude: '',
        visibilityRadius: '',
        editorId: '',
    });

    useEffect(() => {
        const getEditorId = async () => {
            const editorId = await AsyncStorage.getItem('userId'); // Assuming the editor's ID is stored with the key 'userId'
            if (editorId) {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    editorId: editorId
                }));
            }
        };
        getEditorId();
    }, []);

    const handleChange = (name, value) => {
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            // Add logic to validate form data
            // ...
    
            // Call the function to add a new game location
            await addGameLocation(formData);
            Alert.alert("Success", "Location added successfully.");
    
            // Optionally reset form
            setFormData({
                name: '',
                description: '',
                websiteUrl: '',
                imageUrl: '',
                promoInfo: '',
                latitude: '',
                longitude: '',
                visibilityRadius: '',
                editorId: ''
            });
        } catch (error) {
            console.error("Error adding location:", error);
            Alert.alert("Error", "Failed to add location.");
        }
    };

    return (
        <View style={styles.container}>
            {/* Form fields */}
            <TextInput style={styles.input} placeholder="Name" onChangeText={text => handleChange('name', text)} value={formData.name} />
            <TextInput style={styles.input} placeholder="Description" onChangeText={text => handleChange('description', text)} value={formData.description} />
            <TextInput style={styles.input} placeholder="Website URL" onChangeText={text => handleChange('websiteUrl', text)} value={formData.websiteUrl} />
            <TextInput style={styles.input} placeholder="Image URL" onChangeText={text => handleChange('imageUrl', text)} value={formData.imageUrl} />
            <TextInput style={styles.input} placeholder="Promo Info" onChangeText={text => handleChange('promoInfo', text)} value={formData.promoInfo} />
            <TextInput style={styles.input} placeholder="Latitude" onChangeText={text => handleChange('latitude', text)} value={formData.latitude} />
            <TextInput style={styles.input} placeholder="Longitude" onChangeText={text => handleChange('longitude', text)} value={formData.longitude} />
            <TextInput style={styles.input} placeholder="Visibility Radius" onChangeText={text => handleChange('visibilityRadius', text)} value={formData.visibilityRadius} />

            {/* Submit Button */}
            <Button title="Add Location" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
    },
});

export default AddLocationForm;
