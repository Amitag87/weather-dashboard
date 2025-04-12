import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api';

export const getWeatherByCity = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather/${city}`);
    return response.data;
  } catch (error) {
    console.error('Weather fetch error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
  }
};

export const getForecastByCity = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast/${city}`);
    return response.data;
  } catch (error) {
    console.error('Forecast fetch error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch forecast data');
  }
};

// Optional: Keep this if you need coordinate-based weather
export const getWeatherByCoordinates = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: { lat, lon }
    });
    return response.data;
  } catch (error) {
    console.error('Weather fetch error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
  }
}; 