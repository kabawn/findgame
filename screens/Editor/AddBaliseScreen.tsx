import React, { useState, useEffect } from 'react';
import { ScrollView, TextInput, Button, StyleSheet, Alert, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker'; // Updated import

const BASE_URL = "http://192.168.1.78:8086";

const AddBaliseForm = () => {
    const [formData, setFormData] = useState({
        type: 'ORIGIN',
        latitude: '',
        longitude: '',
        searchRadius: '',
        userId: '',
    });

    useEffect(() => {
        const getUserId = async () => {
            const userId = await AsyncStorage.getItem('userId');
            if (userId) {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    userId: userId
                }));
            }
        };
        getUserId();
    }, []);

    const handleChange = (name, value) => {
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/balises`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to add Balise');
            Alert.alert("Success", "Balise added successfully.");
            setFormData({
                type: 'ORIGIN',
                latitude: '',
                longitude: '',
                searchRadius: '',
                userId: formData.userId, // Keep userId
            });
        } catch (error) {
            console.error("Error adding Balise:", error);
            Alert.alert("Error", "Failed to add Balise.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Balise Type Picker */}
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={formData.type}
                    onValueChange={(itemValue) => handleChange('type', itemValue)}
                    style={styles.picker}>
                    <Picker.Item label="Origin" value="ORIGIN" />
                    <Picker.Item label="Secondary" value="SECONDARY" />
                    <Picker.Item label="Mobile" value="MOBILE" />
                    <Picker.Item label="Temporary" value="TEMPORARY" />
                    <Picker.Item label="Invisible" value="INVISIBLE" />
                </Picker>
            </View>

            {/* Other Input Fields */}
            <TextInput
                style={styles.input}
                placeholder="Latitude"
                onChangeText={text => handleChange('latitude', text)}
                value={formData.latitude}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Longitude"
                onChangeText={text => handleChange('longitude', text)}
                value={formData.longitude}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Search Radius"
                onChangeText={text => handleChange('searchRadius', text)}
                value={formData.searchRadius}
                keyboardType="numeric"
            />

            {/* Submit Button */}
            <Button title="Add Balise" onPress={handleSubmit} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        padding: 10,
    },
    pickerContainer: {
        marginBottom: 20,
    },
    picker: {
        width: '100%',
        height: 50,
    },
});

export default AddBaliseForm;
