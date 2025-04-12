import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
    const [city, setCity] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim()) {
            onSearch(city);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <div className="search-container">
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name..."
                    className="search-input"
                />
                <button type="submit" className="search-button">
                    <span className="search-icon">🔍</span>
                    Search
                </button>
            </div>
        </form>
    );
};

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
};

export default SearchBar; 