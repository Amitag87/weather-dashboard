const express = require('express');
const axios = require('axios');
const router = express.Router();

// Current weather endpoint
router.get('/:city', async (req, res) => {
    const { city } = req.params;
    
    if (!city) {
        return res.status(400).json({ error: 'City name is required' });
    }

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
        );
        res.json(response.data);
    } catch (error) {
        console.error('OpenWeather API Error:', error.response?.data || error.message);
        
        if (error.response && error.response.status === 404) {
            res.status(404).json({ error: 'City not found' });
        } else {
            res.status(500).json({ error: 'Error fetching weather data' });
        }
    }
});

// 5-day forecast endpoint
router.get('/forecast/:city', async (req, res) => {
    const { city } = req.params;
    
    if (!city) {
        return res.status(400).json({ error: 'City name is required' });
    }

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
        );
        res.json(response.data);
    } catch (error) {
        console.error('OpenWeather API Error:', error.response?.data || error.message);
        
        if (error.response && error.response.status === 404) {
            res.status(404).json({ error: 'City not found' });
        } else {
            res.status(500).json({ error: 'Error fetching forecast data' });
        }
    }
});

module.exports = router; 