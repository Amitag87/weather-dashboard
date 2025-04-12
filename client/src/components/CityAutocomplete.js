import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';

const CityAutocomplete = ({ onSelect, searches }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const fetchSuggestions = useCallback(
        debounce(async (input) => {
            if (!input) {
                setSuggestions([]);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5001/api/cities?query=${input}`);
                setSuggestions(response.data);
            } catch (error) {
                console.error('Error fetching city suggestions:', error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 300),
        []
    );

    useEffect(() => {
        if (query) {
            fetchSuggestions(query);
        } else {
            setSuggestions([]);
        }
    }, [query, fetchSuggestions]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        setShowDropdown(true);
    };

    const handleSelect = (city) => {
        setQuery(city);
        setShowDropdown(false);
        onSelect(city);
    };

    return (
        <div className="search-container">
            <div className="search-input-wrapper">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Enter city name..."
                    className="search-input"
                />
                <button 
                    onClick={() => handleSelect(query)}
                    className="search-button"
                    disabled={!query}
                >
                    Search
                </button>
            </div>
            
            {showDropdown && (query || suggestions.length > 0) && (
                <div className="dropdown-content">
                    {loading ? (
                        <div className="loading">Loading...</div>
                    ) : (
                        <div className="suggestions-container">
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="suggestion-item"
                                    onClick={() => handleSelect(suggestion)}
                                >
                                    {suggestion}
                                </div>
                            ))}
                            {suggestions.length === 0 && query && (
                                <div className="suggestion-item">No cities found</div>
                            )}
                        </div>
                    )}
                </div>
            )}
            
            {searches.length > 0 && !showDropdown && (
                <div className="search-history">
                    <h4>Recent Searches</h4>
                    <div className="history-buttons">
                        {searches.map((city, index) => (
                            <button
                                key={index}
                                onClick={() => handleSelect(city)}
                                className="history-button"
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CityAutocomplete; 