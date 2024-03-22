import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BalisesWithContentsScreen = () => {
    const [balisesWithContents, setBalisesWithContents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Retrieve the user ID from storage
                const storedUserId = await AsyncStorage.getItem("userId");
                if (!storedUserId) {
                    console.error("No user ID found");
                    return;
                }
                
                // Use the retrieved user ID in the API request
                const response = await fetch(`http://192.168.1.78:8086/api/balises/users/${storedUserId}/balises-with-contents`);
                if (!response.ok) {
                    throw new Error('Failed to fetch balises and contents');
                }
                const data = await response.json();
                setBalisesWithContents(data);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle error, e.g., set an error state, show a message, etc.
            }
        };

        fetchData();
    }, []);

    return (
        <ScrollView style={styles.container}>
            {balisesWithContents.map((baliseWithContent, index) => (
                <View key={index} style={styles.baliseContainer}>
                    <Text style={styles.baliseTitle}>{baliseWithContent.balise.name}</Text>
                    {baliseWithContent.contents.map((content, contentIndex) => (
                        <View key={contentIndex} style={styles.contentContainer}>
                            <Text style={styles.contentTitle}>{content.title}</Text>
                            <Text style={styles.contentBody}>Descreption: {content.body}</Text>
                            <Text style={styles.contentBody}>Phone: {content.properties.phone}</Text>
                            <Text style={styles.contentBody}>Skill Level: {content.properties.skillLevel}</Text>
                            <Text style={styles.contentBody}>Years of Experience: {content.properties.yearsOfExperience}</Text>
                            <Text style={styles.contentBody}>Email: {content.properties.email}</Text>
                            {content.imageUrl && (
                                <Image
                                    source={{ uri: content.imageUrl }}
                                    style={styles.image}
                                />
                            )}
                            {/* Display other properties as needed */}
                            
                        </View>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f9f9f9',
    },
    baliseContainer: {
        marginBottom: 20,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden', // Ensures child elements do not overlap the rounded corners
    },
    baliseTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        padding: 10,
    },
    contentContainer: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
    },
    contentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    contentBody: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
        marginBottom: 10,
    },
    image: {
        width: '100%', // Adjusted to take the full width of the card
        height: 200, // Adjusted for a better aspect ratio
        borderRadius: 8, // Rounded corners for images
        marginTop: 10,
        marginBottom: 10, // Space after the image
    },
});

export default BalisesWithContentsScreen;
