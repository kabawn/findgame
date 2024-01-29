import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TreasureBox = ({ promoInfo }) => {
    const [isOpen, setIsOpen] = useState(false);
    const rotateAnim = new Animated.Value(0);

    const handlePress = () => {
        if (isOpen) return; // Prevent re-opening if already open

        Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
        }).start(() => setIsOpen(true));
    };

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'] // Rotates 360 degrees
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePress}>
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                    <MaterialCommunityIcons name={isOpen ? 'gift-open-outline' : 'gift-outline'} size={50} color="#F5A623" />
                </Animated.View>
            </TouchableOpacity>

            {isOpen && (
                <View style={styles.promoCard}>
                    <Text style={styles.promoText}>{promoInfo}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 20,
    },
    promoCard: {
        marginTop: 10,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    promoText: {
        fontSize: 16,
        color: '#333'
    },
    // Add more styles as needed
});

export default TreasureBox;
