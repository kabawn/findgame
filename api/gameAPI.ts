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


export const addGameLocation = async (locationData, imageUri) => {
  const token = await getToken();
  
  const formData = new FormData();
  formData.append('gameLocation', JSON.stringify(locationData), { type: 'application/json' }); // Append game location data with the correct content type

  if (imageUri) {
    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    formData.append('file', {
      uri: imageUri,
      name: `photo.${fileType}`, // or another filename
      type: `image/${fileType}`, // or another file type
    });
  }

  try {
    const response = await fetch(`${BASE_URL}/game-locations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Do not set 'Content-Type' manually; let FormData set it
      },
      body: formData,
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

export const fetchGameLocationsByEditor = async () => {
  try {
    const editorId = await AsyncStorage.getItem('userId'); // Assuming 'userId' is stored in AsyncStorage
    const response = await fetch(`${BASE_URL}/game-locations/editor/${editorId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching game locations by editor:", error);
    throw error;
  }
};




