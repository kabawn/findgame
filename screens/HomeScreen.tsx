// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the Game!</Text>
      <Button title="Discover Items" onPress={() => navigation.navigate('Discover')} />

      <Button title="Search" onPress={() => navigation.navigate('SearchScreen')} />

    </View>
  );
}

export default HomeScreen;
