import AsyncStorage from '@react-native-async-storage/async-storage';


export const BASE_URL = "http://192.168.1.78:8086";
const getToken = async () => {
  return await AsyncStorage.getItem('userToken');
};

export const fetchGameLocations = async () => {
  try {
    const response = await fetch(`${BASE_URL}/game-locations`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching game locations:", error);
    throw error;
  }
};




export const fetchDiscoverableGameLocationsForUser = async (userId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/game-locations/user/${userId}/discoverable`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    console.log('Received data from fetchDiscoverableGameLocationsForUser:', text);
    
    if (!text) {
      throw new Error('No data returned by the API');
    }
    return JSON.parse(text);
  } catch (error) {
    console.error(`Error fetching discoverable game locations for user ${userId}:`, error);
    throw error;
  }
};

export const fetchUserLocation = async (userId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/location`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user location:", error);
    throw error;
  }
};

export const updateUserLocation = async (userId: number, latitude: number, longitude: number) => {
  try {
      const token = await getToken(); // Get the token before making a request
      const response = await fetch(`${BASE_URL}/users/${userId}/location`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // Use the token here
          },
          body: JSON.stringify({ latitude, longitude })
      });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating user location:", error);
        throw error;
    }

    
};

export const fetchUserData = async (userId: number) => {
  try {
      const response = await fetch(`${BASE_URL}/users/${userId}`);
      const data = await response.json();
      return data;
  } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
  }
};


export const updateUserSearchRadius = async (userId, newRadius) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${BASE_URL}/users/${userId}/search-radius`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      // Send the newRadius value directly as a JSON body
      body: JSON.stringify(newRadius)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user search radius:", error);
    throw error;
  }
};


export const addGameLocation = async (locationData) => {
  try {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/game-locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(locationData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding game location:", error);
    throw error;
  }
};
