import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchMovieById, DEFAULT_MOVIE_IDS, fetchMoviesBySearch } from '../services/moviesApi';
import MovieCard from '../ui/MovieCard';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('title-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  const moviesPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      loadDefaultMovies();
    }
  }, [searchQuery]);

  const loadDefaultMovies = async () => {
    setLoading(true);
    try {
      const moviePromises = DEFAULT_MOVIE_IDS.map((id) =>
        fetchMovieById(id)
      );
      const fetchedMovies = await Promise.all(moviePromises);
      const validMovies = fetchedMovies.filter((movie) => movie !== null);
      setMovies(validMovies);
    } catch (error) {
      console.error('Error loading default movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const searchResults = await fetchMoviesBySearch(query);
      setMovies(searchResults);
    } catch (error) {
      console.error('Error searching movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const sortMovies = (moviesToSort, sortOption) => {
    const sorted = [...moviesToSort];

    switch (sortOption) {
      case 'title-asc':
        sorted.sort((a, b) => a.Title.localeCompare(b.Title));
        break;
      case 'title-desc':
        sorted.sort((a, b) => b.Title.localeCompare(a.Title));
        break;
      case 'year-new':
        sorted.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
        break;
      case 'year-old':
        sorted.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
        break;
      case 'rating-high':
        sorted.sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating));
        break;
      case 'rating-low':
        sorted.sort((a, b) => parseFloat(a.imdbRating) - parseFloat(b.imdbRating));
        break;
      default:
        break;
    }

    return sorted;
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const sortedMovies = sortMovies(movies, sortBy);

  // Pagination
  const totalPages = Math.ceil(sortedMovies.length / moviesPerPage);
  const startIndex = (currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const paginatedMovies = sortedMovies.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <main className="main">
      {/* Controls Section */}
      <div className="controls">
        <div>
          {searchQuery && <p>Showing: "{searchQuery}"</p>}
          {!loading && <p>{sortedMovies.length} movies</p>}
        </div>

        <div>
          <label htmlFor="sortSelect">Sort by:</label>
          <select
            id="sortSelect"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="year-new">Year (Newest)</option>
            <option value="year-old">Year (Oldest)</option>
            <option value="rating-high">Rating (High to Low)</option>
            <option value="rating-low">Rating (Low to High)</option>
          </select>
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="movies-grid">
          {Array(10)
            .fill(null)
            .map((_, i) => (
              <MovieCard key={`skeleton-${i}`} isLoading={true} />
            ))}
        </div>
      ) : paginatedMovies.length > 0 ? (
        <>
          <div className="movies-grid">
            {paginatedMovies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} isLoading={false} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px', marginBottom: '20px', alignItems: 'center' }}>
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              style={{
                padding: '10px 15px',
                border: 'none',
                borderRadius: '8px',
                background: currentPage === 1 ? '#333' : '#000',
                color: currentPage === 1 ? '#999' : '#fff',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontWeight: '600',
              }}
            >
              ← Previous
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    padding: '10px 14px',
                    border: 'none',
                    borderRadius: '6px',
                    background: currentPage === page ? '#555' : '#000',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: currentPage === page ? 'bold' : '600',
                  }}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              style={{
                padding: '10px 15px',
                border: 'none',
                borderRadius: '8px',
                background: currentPage === totalPages ? '#333' : '#000',
                color: currentPage === totalPages ? '#999' : '#fff',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontWeight: '600',
              }}
            >
              Next →
            </button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <h2>No movies found</h2>
          <p>Try searching for different movies</p>
        </div>
      )}
    </main>
  );
};

export default Home;