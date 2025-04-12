import React from 'react';
import { useTheme } from '../context/ThemeContext';

function SearchHistory({ searches, onSelect }) {
  const { isDarkMode } = useTheme();

  if (!searches || searches.length === 0) return null;

  return (
    <div className={`search-history ${isDarkMode ? 'dark' : ''}`}>
      <h4>Recent Searches:</h4>
      <div className="history-buttons">
        {searches.map((city, index) => (
          <button
            key={index}
            onClick={() => onSelect(city)}
            className="history-button"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchHistory; 