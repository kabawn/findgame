import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import ItemDetailsScreen from '../screens/ItemDetailsScreen';
import Signup from '../screens/Signup';  // Import the Signup screen
import Login from '../screens/Login';    // Import the Login screen
import AddLocationForm from '../screens/Editor/AddLocationForm'; // Update with correct path
import BottomTabNavigator from '..//screens/BottomTabNavigator'; // Import BottomTabNavigator
import LocationDetailsScreen from '../screens/Editor/LocationDetailsScreen'; // Update with correct path
import AddBaliseScreen from '../screens/Editor/AddBaliseScreen';
import AddCategoryForm from '../screens/Editor/AddCategoryForm';
import AddContentForm from '../screens/Editor/AddContentForm';
import BalisesWithContentsScreen from '../screens/Editor/BalisesWithContentsScreen';
import SearchScreen from '../screens/SearchScreen';
const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
            <Stack.Screen name="Signup" component={Signup} options={{ title: 'Signup' }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Find Game' }} />
            <Stack.Screen name="Discover" component={DiscoverScreen} options={{ title: 'Discover Items' }} />
            <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} options={{ title: 'Item Details' }} />
            <Stack.Screen name="AddLocationForm" component={AddLocationForm} />
            <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="LocationDetails" component={LocationDetailsScreen} options={{ title: 'Location Details' }} />
            <Stack.Screen name="AddBaliseScreen" component={AddBaliseScreen}  />
            <Stack.Screen name="AddCategoryForm" component={AddCategoryForm} />
            <Stack.Screen name="AddContentForm" component={AddContentForm} />
            <Stack.Screen name="BalisesWithContentsScreen" component={BalisesWithContentsScreen} />
            <Stack.Screen name="SearchScreen" component={SearchScreen} />




        </Stack.Navigator>
    );
};

export default AppNavigator;
