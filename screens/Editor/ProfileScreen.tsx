import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserData } from '../../api/gameAPI'; // Update path if necessary

const ProfileScreen = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                if (userId) {
                    const data = await fetchUserData(parseInt(userId));
                    setUserData(data);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        loadUserData();
    }, []);

    return (
        <View style={styles.container}>
            {userData && (
                <>
                    <Text style={styles.header}>Profile</Text>
                    <Text style={styles.userInfo}>Name: {userData.firstName} {userData.lastName}</Text>
                    <Text style={styles.userInfo}>Email: {userData.email}</Text>
                    {/* Add more user info fields as needed */}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    userInfo: {
        fontSize: 18,
        marginVertical: 5,
    },
});

export default ProfileScreen;
