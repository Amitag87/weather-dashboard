import React from 'react';

const WeatherCard = ({ weatherData }) => {
    if (!weatherData) return null;

    return (
        <div className="weather-card">
            <h2>{weatherData.city}</h2>
            <div className="weather-main">
                <img
                    src={`http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                    alt={weatherData.condition}
                />
                <div className="temperature">{Math.round(weatherData.temperature)}°C</div>
            </div>
            <div className="weather-details">
                <p className="condition">{weatherData.description}</p>
                <div className="details-grid">
                    <div className="detail-item">
                        <span>Humidity</span>
                        <span>{weatherData.humidity}%</span>
                    </div>
                    <div className="detail-item">
                        <span>Wind Speed</span>
                        <span>{weatherData.windSpeed} m/s</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard; 