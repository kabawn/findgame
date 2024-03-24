// screens/SearchScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Image } from 'react-native';
import * as Location from 'expo-location';

const SearchScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [keywords, setKeywords] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const searchItems = async () => {
    // Assuming you have a function to call your API
    const apiURL = `http://192.168.1.78:8086/api/contents/search?keywords=${keywords}&latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`;
    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Enter keywords"
        value={keywords}
        onChangeText={setKeywords}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      <Button title="Search" onPress={searchItems} />
      <FlatList
        data={results}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontSize: 18 }}>{item.title}</Text>
            <Image source={{ uri: item.imageUrl }} style={{ width: 100, height: 100 }} />
            <Text>{item.body}</Text>
            {/* Display other properties as needed */}
          </View>
        )}
      />
    </View>
  );
};

export default SearchScreen;
