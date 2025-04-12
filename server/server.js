const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const dotenv = require('dotenv');
const validator = require('validator');

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(helmet()); // Set secure HTTP headers
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(xss()); // Prevent XSS attacks

// Basic rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

// OpenWeatherMap API config
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// GeoDB Cities API config
const GEODB_API_KEY = process.env.RAPIDAPI_KEY;
const GEODB_HOST = 'wft-geo-db.p.rapidapi.com';

// Axios instance with timeout
const axiosInstance = axios.create({
  timeout: 8000
});

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
};

// Cities autocomplete
app.get('/api/cities', async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query || !validator.isAlpha(query, 'en-US', { ignore: ' ' })) {
      return res.status(400).json({ error: 'Invalid query' });
    }

    const response = await axiosInstance.get(`https://${GEODB_HOST}/v1/geo/cities`, {
      params: {
        namePrefix: query,
        limit: 5,
        sort: '-population'
      },
      headers: {
        'X-RapidAPI-Key': GEODB_API_KEY,
        'X-RapidAPI-Host': GEODB_HOST
      }
    });

    const cities = response.data.data.map(city =>
      `${city.city}${city.countryCode ? `, ${city.countryCode}` : ''}`
    );
    res.json(cities);
  } catch (err) {
    next(err);
  }
});

// Weather data endpoint
app.get('/api/weather/:city', async (req, res, next) => {
  try {
    const city = req.params.city.trim();
    if (!city || !validator.isAscii(city)) {
      throw { status: 400, message: 'Invalid city format' };
    }

    const response = await axiosInstance.get(`${OPENWEATHER_BASE_URL}/weather`, {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });

    const weatherData = {
      name: response.data.name,
      main: response.data.main,
      weather: response.data.weather,
      wind: response.data.wind
    };

    res.json(weatherData);
  } catch (err) {
    if (err.response?.status === 404) {
      next({ status: 404, message: 'City not found' });
    } else {
      next(err);
    }
  }
});

// Forecast data endpoint
app.get('/api/forecast/:city', async (req, res, next) => {
  try {
    const city = req.params.city.trim();
    if (!city || !validator.isAscii(city)) {
      throw { status: 400, message: 'Invalid city format' };
    }

    const response = await axiosInstance.get(`${OPENWEATHER_BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });

    const dailyForecasts = {};
    response.data.list.forEach(forecast => {
      const date = new Date(forecast.dt * 1000).toLocaleDateString();
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = forecast;
      }
    });

    res.json({
      city: response.data.city,
      list: Object.values(dailyForecasts).slice(0, 5)
    });
  } catch (err) {
    if (err.response?.status === 404) {
      next({ status: 404, message: 'City not found' });
    } else {
      next(err);
    }
  }
});

// Fallback 404 for unknown routes
app.all('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Use centralized error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Plague-proof server running on port ${port}`);
});