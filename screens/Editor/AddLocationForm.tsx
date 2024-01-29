import React, { useState, useEffect } from 'react';
import { ScrollView, TextInput, Button, StyleSheet, Alert, Image, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addGameLocation } from '..//..//api/gameAPI';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

const AddLocationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        websiteUrl: '',
        promoInfo: '',
        latitude: '',
        longitude: '',
        visibilityRadius: '',
        editorId: '',
    });
    const [image, setImage] = useState(null);

    useEffect(() => {
        const getEditorId = async () => {
            const editorId = await AsyncStorage.getItem('userId');
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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.canceled) { // Updated from 'cancelled' to 'canceled'
            const selectedImageUri = result.assets[0].uri;
            setImage(selectedImageUri);
        }
    };
    
    

    const handleSubmit = async () => {
        try {
            await addGameLocation(formData, image);
            Alert.alert("Success", "Location added successfully.");
            setFormData({
                name: '',
                description: '',
                websiteUrl: '',
                promoInfo: '',
                latitude: '',
                longitude: '',
                visibilityRadius: '',
                editorId: ''
            });
            setImage(null);
        } catch (error) {
            console.error("Error adding location:", error);
            Alert.alert("Error", "Failed to add location.");
        }
    };


    const renderInputField = (name, placeholder, iconName) => {
        return (
            <View style={styles.inputContainer}>
                <MaterialIcons name={iconName} size={24} color="black" />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    onChangeText={text => handleChange(name, text)}
                    value={formData[name]}
                />
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            {/* Input Fields */}
            {renderInputField('name', 'Name', 'place')}
            {renderInputField('description', 'Description', 'description')}
            {renderInputField('websiteUrl', 'Website URL', 'public')}
            {renderInputField('promoInfo', 'Promo Info', 'local-offer')}
            {renderInputField('latitude', 'Latitude', 'explore')}
            {renderInputField('longitude', 'Longitude', 'explore')}
            {renderInputField('visibilityRadius', 'Visibility Radius', 'visibility')}

            {/* Image Picker */}
            <View style={styles.buttonContainer}>
                <Button title="Pick an image" onPress={pickImage} />
            </View>
            {image && <Image source={{ uri: image }} style={styles.image} />}

            {/* Submit Button */}
            <View style={styles.buttonContainer}>
                <Button title="Add Location" onPress={handleSubmit} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        marginBottom: 15,
        paddingVertical: 5,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        height: 40,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 10,
        alignSelf: 'center',
    },
    buttonContainer: {
        marginBottom: 20,
        marginTop: 10,
    },
});

export default AddLocationForm;