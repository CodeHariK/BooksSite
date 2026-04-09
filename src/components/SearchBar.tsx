import React, { useState, useEffect } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  initialValue?: string;
  mode?: 'books' | 'authors';
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder, initialValue = '', mode }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  return (
    <div className="search-bar-container" data-mode={mode}>
      <div className="search-bar-inner">
        <input 
          type="text" 
          placeholder={placeholder || "Search..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="search-icon-wrapper">
          <img src="/temp_assets/search.svg" alt="Search" width="20" height="20" />
        </div>
        {searchTerm && (
          <button 
            className="clear-search" 
            onClick={() => setSearchTerm('')}
            title="Clear search"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
