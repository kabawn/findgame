import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import EditorDashboard from '../screens/Editor/EditorDashboard';
import LocationsScreen from '../screens/Editor/LocationsScreen';
import ProfileScreen from '../screens/Editor/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Dashboard" 
        component={EditorDashboard} 
        options={{ tabBarIcon: ({ color, size }) => 
          <MaterialIcons name="dashboard" size={size} color={color} /> 
        }}
      />
      <Tab.Screen 
        name="Locations" 
        component={LocationsScreen} 
        options={{ tabBarIcon: ({ color, size }) => 
          <MaterialIcons name="location-pin" size={size} color={color} /> 
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarIcon: ({ color, size }) => 
          <MaterialIcons name="person" size={size} color={color} /> 
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
