import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SearchResults = () => {
  const { searchQuery } = useParams();
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0); // Track the total number of pages

  useEffect(() => {
    if (!searchQuery) {
      setError('No search query provided');
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null); // Reset error on new fetch

      try {
        // Fetch data from backend with search query and page number
        const response = await fetch(`http://localhost:5000/search?q=${searchQuery}&page=${page}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }

        const data = await response.json();
        
        // Set results and totalPages based on the response from the backend
        setResults(data.items);
        setTotalPages(data.totalPages); // Store total pages for pagination
      } catch (err) {
        console.error('Error fetching results:', err);  // Log the full error details
        setError('There was an issue fetching the search results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [page, searchQuery]); // Fetch data when the search query or page changes

  const handleNextPage = () => {
    if (page < totalPages) { // Navigate to next page if it's not the last page
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) { // Navigate to previous page if it's not the first page
      setPage(page - 1);
    }
  };

  return (
    <div className="search-results">
      <h1>Search Results for "{searchQuery}"</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results.length === 0 && !loading && !error && (
        <p>No results found</p>
      )}

      {results.map((item, index) => (
        <div key={index} className="result-item">
          <h2>{item.itemName}</h2>
          <p><strong>Location:</strong> {item.location}</p>
          <p><strong>Date:</strong> {item.date}</p>
          <p><strong>Description:</strong> {item.description}</p>

          {item.image ? (
            <img src={item.image} alt={item.itemName} />
          ) : (
            <div>No photo available</div>
          )}
        </div>
      ))}

      {/* Pagination Controls */}
      <div className="pagination">
        <button 
          onClick={handlePrevPage} 
          disabled={page === 1} 
          aria-label="Previous page"
        >
          Previous
        </button>
        <span>{page} of {totalPages}</span>
        <button 
          onClick={handleNextPage} 
          disabled={page === totalPages} 
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SearchResults;
