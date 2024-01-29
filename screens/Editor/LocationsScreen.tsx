import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl ,TouchableOpacity} from 'react-native';
import { fetchGameLocationsByEditor } from '..//..//api/gameAPI';

const LocationsScreen = ({ navigation }) => {
    const [locations, setLocations] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const onLocationPress = (location) => {
        navigation.navigate('LocationDetails', { location });
    };


    const loadLocations = async () => {
        try {
            const data = await fetchGameLocationsByEditor(); // Fetch locations by editor
            setLocations(data);
            setRefreshing(false); // Reset the refreshing state
        } catch (error) {
            console.error("Error fetching locations:", error);
            setRefreshing(false); // Reset the refreshing state
        }
    };

    useEffect(() => {
        loadLocations();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadLocations();
    };

   const renderLocation = ({ item }) => {
        return (
            <TouchableOpacity style={styles.locationItem} onPress={() => onLocationPress(item)}>
                <Text style={styles.locationName}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={locations}
                renderItem={renderLocation}
                keyExtractor={item => item.id.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    locationItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    locationName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LocationsScreen;
