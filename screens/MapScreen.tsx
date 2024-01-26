import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

const DiscoverScreen = () => {
  const [location, setLocation] = useState(null);
  const [items, setItems] = useState([]); // This will store the game locations
  const [fillOpacity] = useState(new Animated.Value(0.3));

  useEffect(() => {
    // Fetch the user's location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();

    // Fetch game locations
    // For the sake of this example, I'm using a static list
    setItems([
      // Replace this with actual data from your API
      {
        id: 1,
        latitude: 43.65014136432911,
        longitude: 1.4443009203665527,
        htmlContent: "Game Location 1"
      },
      // Add more locations as needed
    ]);

    // Flashing animation for the circle
    Animated.loop(
      Animated.sequence([
        Animated.timing(fillOpacity, {
          toValue: 0.6,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fillOpacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={location} title="Your Location" />

          <Animated.View style={{ opacity: fillOpacity }}>
            <Circle
              center={location}
              radius={100} // adjust as needed
              strokeWidth={1}
              strokeColor={'#3399ff'}
              fillColor={'rgba(51,153,255,0.3)'}
            />
          </Animated.View>

          {items.map(item => (
            <Marker
              key={item.id}
              coordinate={{ latitude: item.latitude, longitude: item.longitude }}
              title={item.htmlContent}
            />
          ))}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default DiscoverScreen;
