import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { BASE_URL } from '../api/gameAPI';

interface SignupProps {
  navigation: any;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const Signup: React.FC<SignupProps> = ({ navigation }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [selectedRole, setSelectedRole] = useState<'user' | 'editor'>('user');

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const updatedFormData = { ...formData, role: selectedRole };
    try {
      const response = await fetch(`${BASE_URL}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFormData)
      });

      const data = await response.json();
      if (data.id) {
        navigation.navigate('Login');
      } else {
        // Handle signup errors
        alert('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred during signup. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
      <Text style={styles.headerText}>Sign Up</Text>
        <Image
          source={require('../assets/lockopen.png')} // Make sure this path is correct
          style={styles.lockImage}
        />
                <TextInput
          style={styles.input}
          onChangeText={(value) => handleChange('firstName', value)}
          value={formData.firstName}
          placeholder="First Name"
        />
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleChange('lastName', value)}
          value={formData.lastName}
          placeholder="Last Name"
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
        <View style={styles.roleToggleContainer}>
          <TouchableOpacity
            style={[
              styles.roleToggleButton,
              selectedRole === 'user' ? styles.roleToggleButtonActive : {}
            ]}
            onPress={() => setSelectedRole('user')}
          >
            <Text
              style={[
                styles.roleToggleButtonText,
                selectedRole === 'user' ? styles.roleToggleButtonTextActive : {}
              ]}
            >
              User
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.roleToggleButton,
              selectedRole === 'editor' ? styles.roleToggleButtonActive : {}
            ]}
            onPress={() => setSelectedRole('editor')}
          >
            <Text
              style={[
                styles.roleToggleButtonText,
                selectedRole === 'editor' ? styles.roleToggleButtonTextActive : {}
              ]}
            >
              Editor
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleSubmit} style={styles.signupButton}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
            Login
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
    alignItems: 'center', // This will help to align card to the center horizontally
    justifyContent: 'center', // This will help to align card to the center vertically
  },
  header: {
    backgroundColor: '#3629B7',
    // You can add additional header styles if needed
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center', // This will center all children horizontally
    width: '100%', // Set the width according to your design preference
    // Shadow styles if needed
    // ... Rest of your card styles
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000', // Change to the color according to your design preference
    marginBottom: 20, // Adjust the spacing as per your design
  },
  input: {
    height: 50,
    width:300,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15,
  },
  signupButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  signupButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  loginText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  loginLink: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  lockImage: {
    width: 120, // Set the width as per your design
    height: 120, // Set the height as per your design
    marginBottom: 20, // Adjust the spacing as per your design
  },
  welcomeBack: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  roleToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  roleToggleButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 5,
  },
  roleToggleButtonActive: {
    backgroundColor: '#007BFF',
  },
  roleToggleButtonText: {
    textAlign: 'center',
    color: '#007BFF',
  },
  roleToggleButtonTextActive: {
    color: '#FFFFFF',
  },
  // ... rest of your styles
});

export default Signup;
