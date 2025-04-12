import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import WeatherCard from './components/WeatherCard';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Error Boundary to shield the app from crashes
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("Error Boundary Caught:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return <h2>Something went wrong. You're still safe 😇</h2>;
        }
        return this.props.children;
    }
}

function AppContent() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [searchHistory, setSearchHistory] = useState(() => {
        try {
            const saved = localStorage.getItem('searchHistory');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const { isDarkMode } = useTheme();

    useEffect(() => {
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }, [searchHistory]);

    const sanitizeInput = (input) => input.replace(/[^a-zA-Z\s]/g, '').trim();

    const handleSearch = async (e) => {
        e.preventDefault();
        const sanitizedInput = sanitizeInput(searchInput);
        if (!sanitizedInput) return;

        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:5001/api/weather/${sanitizedInput}`);

            if (response.data && response.data.cod !== '404') {
                setWeatherData(response.data);
                setSearchHistory(prev => {
                    const newHistory = [sanitizedInput, ...prev.filter(item => item !== sanitizedInput)].slice(0, 5);
                    return newHistory;
                });
                setSearchInput('');
                setIsInputFocused(false);
            } else {
                throw new Error('City not found');
            }
        } catch (err) {
            console.error('Error fetching weather:', err);
            setError(err?.response?.data?.message || 'Could not fetch weather data. Try again.');
            setWeatherData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleHistoryClick = (city) => {
        setSearchInput(city);
        const event = { preventDefault: () => {} };
        handleSearch(event);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const container = document.querySelector('.search-container');
            if (container && !container.contains(event.target)) {
                setIsInputFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
            <header className="app-header">
                <h1>Weather Dashboard</h1>
                <ThemeToggle />
            </header>
            <main className="app-main">
                <div className="search-container">
                    <form onSubmit={handleSearch} className="search-input-wrapper">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onFocus={() => setIsInputFocused(true)}
                            placeholder="Enter city name..."
                            className="search-input"
                        />
                        <button type="submit" className="search-button">Search</button>
                    </form>
                    {isInputFocused && searchHistory.length > 0 && (
                        <div className="search-history">
                            <h3>Recent Searches</h3>
                            <div className="history-buttons">
                                {searchHistory.map((city, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleHistoryClick(city)}
                                        className="history-button"
                                    >
                                        {city}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {error && <div className="error">{error}</div>}
                {loading && <div className="loading">Loading...</div>}
                {weatherData && <WeatherCard weatherData={weatherData} />}
            </main>
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <ErrorBoundary>
                <AppContent />
            </ErrorBoundary>
        </ThemeProvider>
    );
}

export default App;
