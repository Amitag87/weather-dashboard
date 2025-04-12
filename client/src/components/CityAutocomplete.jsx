import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './CityAutocomplete.css';

const CityAutocomplete = ({ onSelect }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCities = async () => {
            if (query.length < 2) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(
                    `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=5`,
                    {
                        headers: {
                            'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
                            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
                        }
                    }
                );
                const data = await response.json();
                setSuggestions(data.data || []);
            } catch (error) {
                console.error('Error fetching cities:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchCities, 300);
        return () => clearTimeout(debounceTimer);
    }, [query]);

    const handleSelect = (city) => {
        setQuery(city.name);
        setSuggestions([]);
        onSelect(city.name);
    };

    return (
        <div className="autocomplete-container">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a city..."
                className="autocomplete-input"
            />
            {loading && <div className="loading-spinner"></div>}
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((city) => (
                        <li
                            key={city.id}
                            onClick={() => handleSelect(city)}
                            className="suggestion-item"
                        >
                            {city.name}, {city.countryCode}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

CityAutocomplete.propTypes = {
    onSelect: PropTypes.func.isRequired,
};

export default CityAutocomplete; 