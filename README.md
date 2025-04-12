# Weather Dashboard

A modern weather dashboard application built with React and Node.js that provides current weather information and 5-day forecasts for cities worldwide.

## Features

- 🌤 Real-time weather data from OpenWeatherMap API
- 🌙 Dark/Light mode toggle
- 📱 Responsive design
- 🕒 Recent searches history
- 🌡 Detailed weather information including:
  - Temperature (current, feels like, min/max)
  - Weather conditions with icons
  - Humidity levels
  - Wind speed
  - Atmospheric pressure

## Setup Instructions

### Server Setup

1. Navigate to the server directory:

   ```bash
   cd weather-dashboard/server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory:

   ```
   PORT=5001
   OPENWEATHER_API_KEY=your_openweathermap_api_key_here
   ```

4. Start the server:
   ```bash
   npm start
   ```
   The server will run on http://localhost:5001

### Client Setup

1. Navigate to the client directory:

   ```bash
   cd weather-dashboard/client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory:

   ```
   REACT_APP_RAPIDAPI_KEY=your_rapidapi_key_here
   ```

4. Start the client:
   ```bash
   npm start
   ```
   The application will open in your browser at http://localhost:3000

## API Keys Setup

1. For the OpenWeatherMap API:

   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your API key from your account dashboard
   - Add it to the server's `.env` file

2. For the GeoDB Cities API:
   - Sign up at [RapidAPI](https://rapidapi.com/auth/sign-up)
   - Subscribe to the GeoDB Cities API
   - Get your API key from the API dashboard
   - Add it to the client's `.env` file as `REACT_APP_RAPIDAPI_KEY`

## Project Structure

```
weather-dashboard/
├── client/                 # React frontend
│   ├── public/
│   │   ├── components/    # React components
│   │   ├── context/       # Context providers
│   │   ├── services/      # API services
│   │   └── App.js         # Main App component
│   └── .env              # Client environment variables
└── server/                # Express backend
    ├── server.js         # Express app
    ├── package.json      # Server dependencies
    └── .env             # Server environment variables
```

### Running the Application

1.Start the server:
cd server
npm start

2.Start the client:
cd client
npm start

3.Open your browser and navigate to http://localhost:3000

## Features in Detail

### Current Weather

- Displays current temperature
- Shows "feels like" temperature
- Provides weather condition with icon
- Shows humidity and wind speed
- Displays atmospheric pressure

### Theme Toggle

- Switch between light and dark modes
- Persists theme preference
- Smooth transition animations

### Search History

- Keeps track of recent searches
- Quick access to previous searches

###Technologies Used

Frontend: React.js
Backend: Node.js, Express
API: OpenWeatherMap
Styling: CSS
