import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { BASE_URL } from '../api/gameAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginProps {
  navigation: any;
}

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC<LoginProps> = ({ navigation }) => {
    const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
  
      const data = await response.json();
      if (data.token) {
        // Store token and user ID in AsyncStorage
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userId', data.id.toString());
  
        // Check the role and navigate accordingly
        if (data.role === 'user') {
          navigation.navigate('Home');
        } else if (data.role === 'editor') {
          navigation.navigate('Main', { screen: 'Dashboard' });
        } else {
          alert('Access denied. Unauthorized role.');
        }
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred. Please try again.');
    }
  };
  
  

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.welcomeBack}>Welcome Back</Text>
        <Image
          source={require('..//assets/lock.png')} // Replace with your lock image path
          style={styles.lockImage}
        />
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleChange('email', value)}
          value={formData.email}
          placeholder="Email"
        />
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleChange('password', value)}
          value={formData.password}
          placeholder="Password"
          secureTextEntry
        />
        <TouchableOpacity onPress={handleSubmit} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.signUpText}>
          Don't have an account?{' '}
          <Text
            onPress={() => navigation.navigate('Signup')}
            style={styles.signUpLink}
          >
            Sign Up
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3629B7', // Top part color
  },
  header: {
    backgroundColor: '#3629B7',
  },
  card: {
    marginTop: 80, // Adjust as necessary for your design
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 1,
    alignItems: 'center',
    width:390,
    height:610,
    // Add shadow styles for card if needed
  },
  welcomeBack: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  lockImage: {
    width: 213, // Set image size as needed
    height: 165, // Set image size as needed
    marginVertical: 10,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  loginButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    width: '100%',
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  signUpText: {
    marginVertical: 20,
  },
  signUpLink: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  // ... rest of your styles
});

export default Login;