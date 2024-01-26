import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import ItemDetailsScreen from '../screens/ItemDetailsScreen';
import Signup from '../screens/Signup';  // Import the Signup screen
import Login from '../screens/Login';    // Import the Login screen
import EditorDashboard from '../screens/Editor/EditorDashboard'; // Update with correct path
import AddLocationForm from '../screens/Editor/AddLocationForm'; // Update with correct path

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
            <Stack.Screen name="Signup" component={Signup} options={{ title: 'Signup' }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Find Game' }} />
            <Stack.Screen name="Discover" component={DiscoverScreen} options={{ title: 'Discover Items' }} />
            <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} options={{ title: 'Item Details' }} />
            <Stack.Screen name="EditorDashboard" component={EditorDashboard} />
            <Stack.Screen name="AddLocationForm" component={AddLocationForm} />


        </Stack.Navigator>
    );
};

export default AppNavigator;
