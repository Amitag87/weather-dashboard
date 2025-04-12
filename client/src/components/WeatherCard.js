import React from 'react';

const WeatherCard = ({ weatherData }) => {
    if (!weatherData) return null;

    const {
        name,
        main: { temp, feels_like, humidity, pressure },
        weather: [{ description }],
        wind: { speed }
    } = weatherData;

    return (
        <div className="weather-card">
            <h2>{name}</h2>
            <div className="temperature">{Math.round(temp)}°C</div>
            <div className="weather-info">
                <p>Feels like {Math.round(feels_like)}°C</p>
                <p>{description}</p>
            </div>
            <div className="weather-details">
                <div className="detail-card">
                    <div className="detail-label">Humidity</div>
                    <div className="detail-value">{humidity}%</div>
                </div>
                <div className="detail-card">
                    <div className="detail-label">Wind Speed</div>
                    <div className="detail-value">{speed} m/s</div>
                </div>
                <div className="detail-card">
                    <div className="detail-label">Pressure</div>
                    <div className="detail-value">{pressure} hPa</div>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard; 