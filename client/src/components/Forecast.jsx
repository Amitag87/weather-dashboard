import React from 'react';
import PropTypes from 'prop-types';
import './Forecast.css';

const Forecast = ({ forecastData }) => {
    if (!forecastData || !forecastData.list) return null;

    // Group forecast by day
    const dailyForecast = forecastData.list.reduce((acc, item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = {
                date,
                temp: item.main.temp,
                icon: item.weather[0].icon,
                description: item.weather[0].description,
                humidity: item.main.humidity,
                wind: item.wind.speed
            };
        }
        return acc;
    }, {});

    return (
        <div className="forecast-container">
            <h3>5-Day Forecast</h3>
            <div className="forecast-grid">
                {Object.values(dailyForecast).slice(0, 5).map((day, index) => (
                    <div key={index} className="forecast-card">
                        <div className="forecast-date">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="forecast-icon">
                            <img
                                src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                                alt={day.description}
                            />
                        </div>
                        <div className="forecast-temp">
                            {Math.round(day.temp)}°C
                        </div>
                        <div className="forecast-details">
                            <p>Humidity: {day.humidity}%</p>
                            <p>Wind: {day.wind} m/s</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

Forecast.propTypes = {
    forecastData: PropTypes.shape({
        list: PropTypes.arrayOf(
            PropTypes.shape({
                dt: PropTypes.number,
                main: PropTypes.shape({
                    temp: PropTypes.number,
                    humidity: PropTypes.number,
                }),
                weather: PropTypes.arrayOf(
                    PropTypes.shape({
                        icon: PropTypes.string,
                        description: PropTypes.string,
                    })
                ),
                wind: PropTypes.shape({
                    speed: PropTypes.number,
                }),
            })
        ),
    }),
};

export default Forecast; 