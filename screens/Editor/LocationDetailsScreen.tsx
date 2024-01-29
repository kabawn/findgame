import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';

const LocationDetailsScreen = ({ route }) => {
    const { location } = route.params;

    // Function to open the website URL
    const openWebsite = () => {
        if (location.websiteUrl) {
            Linking.openURL(location.websiteUrl);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: location.imageUrl }} style={styles.image} />
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{location.name}</Text>
                <Text style={styles.description}>{location.description}</Text>

                {/* Additional Details */}
                <Text style={styles.detail}>Website: <Text style={styles.link} onPress={openWebsite}>{location.websiteUrl}</Text></Text>
                <Text style={styles.detail}>Promo Info: {location.promoInfo}</Text>
                <Text style={styles.detail}>Latitude: {location.latitude}</Text>
                <Text style={styles.detail}>Longitude: {location.longitude}</Text>
                <Text style={styles.detail}>Visibility Radius: {location.visibilityRadius} km</Text>
                {/* Add more fields as needed */}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },
    image: {
        width: '100%',
        height: 250,
        resizeMode: 'cover',
    },
    infoContainer: {
        padding: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    description: {
        fontSize: 18,
        color: '#666',
        marginBottom: 15,
    },
    detail: {
        fontSize: 16,
        marginBottom: 5,
    },
    link: {
        color: '#007BFF',
        textDecorationLine: 'underline',
    },
    // Add more styles as needed
});

export default LocationDetailsScreen;
