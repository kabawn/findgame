// screens/ItemDetailsScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';

const ItemDetailsScreen = ({ navigation }) => {
  const item = navigation.getParam('item', {});

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Name: {item.name}</Text>
      <Text>Description: {item.description}</Text>
      // Display other details of the item
    </View>
  );
}

export default ItemDetailsScreen;
