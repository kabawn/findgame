import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const EditorDashboard = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Editor Dashboard</Text>
            {/* Add other UI components and functionality specific to the editor dashboard here */}
            <Button 
                title="Go Back to Login"
                onPress={() => navigation.navigate('AddLocationForm')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7F7F7'
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    }
});

export default EditorDashboard;
