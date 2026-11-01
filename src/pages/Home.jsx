import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  fetchMovieById,
  DEFAULT_MOVIE_IDS,
  fetchMoviesBySearch,
} from '../services/moviesApi';

import MovieCard from '../ui/MovieCard';

const MOVIES_PER_PAGE = 10;

const SORT_OPTIONS = [
  { value: 'title-asc', label: 'Title (A–Z)' },
  { value: 'title-desc', label: 'Title (Z–A)' },
  { value: 'year-new', label: 'Year (Newest)' },
  { value: 'year-old', label: 'Year (Oldest)' },
  { value: 'rating-high', label: 'Rating (High to Low)' },
  { value: 'rating-low', label: 'Rating (Low to High)' },
];

const sortMovies = (movies, sortOption) => {
  const sorted = [...movies];

  const compareNumbers = (a, b, field, descending) => {
    const first = Number.parseFloat(a[field]);
    const second = Number.parseFloat(b[field]);

    const firstMissing = !Number.isFinite(first);
    const secondMissing = !Number.isFinite(second);

    // Keep unavailable values at the end in either direction.
    if (firstMissing && secondMissing) return 0;
    if (firstMissing) return 1;
    if (secondMissing) return -1;

    return descending ? second - first : first - second;
  };

  switch (sortOption) {
    case 'title-asc':
      sorted.sort((a, b) => a.Title.localeCompare(b.Title));
      break;

    case 'title-desc':
      sorted.sort((a, b) => b.Title.localeCompare(a.Title));
      break;

    case 'year-new':
      sorted.sort((a, b) => compareNumbers(a, b, 'Year', true));
      break;

    case 'year-old':
      sorted.sort((a, b) => compareNumbers(a, b, 'Year', false));
      break;

    case 'rating-high':
      sorted.sort((a, b) =>
        compareNumbers(a, b, 'imdbRating', true)
      );
      break;

    case 'rating-low':
      sorted.sort((a, b) =>
        compareNumbers(a, b, 'imdbRating', false)
      );
      break;

    default:
      break;
  }

  return sorted;
};

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = (searchParams.get('search') || '').trim();

  const requestedSort = searchParams.get('sort');
  const sortBy = SORT_OPTIONS.some(
    (option) => option.value === requestedSort
  )
    ? requestedSort
    : 'title-asc';

  const requestedPage = Number(searchParams.get('page') || 1);
  const pageFromUrl =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  useEffect(() => {
    let ignore = false;

    const loadMovies = async () => {
      setLoading(true);
      setMovies([]);

      try {
        let results;

        if (searchQuery) {
          results = await fetchMoviesBySearch(searchQuery);
        } else {
          const fetchedMovies = await Promise.all(
            DEFAULT_MOVIE_IDS.map((id) => fetchMovieById(id))
          );

          results = fetchedMovies.filter(Boolean);
        }

        if (!ignore) {
          setMovies(results);
        }
      } catch (error) {
        console.error('Error loading movies:', error);

        if (!ignore) {
          setMovies([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadMovies();

    return () => {
      ignore = true;
    };
  }, [searchQuery]);

  const sortedMovies = sortMovies(movies, sortBy);

  const totalPages = Math.ceil(
    sortedMovies.length / MOVIES_PER_PAGE
  );

  const currentPage = Math.min(
    pageFromUrl,
    Math.max(totalPages, 1)
  );

  const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;

  const paginatedMovies = sortedMovies.slice(
    startIndex,
    startIndex + MOVIES_PER_PAGE
  );

  const handleSortChange = (event) => {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.set('sort', event.target.value);
    nextParams.delete('page');

    setSearchParams(nextParams);
  };

  const goToPage = (page) => {
    const nextParams = new URLSearchParams(searchParams);
    const nextPage = Math.max(1, Math.min(page, totalPages));

    if (nextPage === 1) {
      nextParams.delete('page');
    } else {
      nextParams.set('page', String(nextPage));
    }

    setSearchParams(nextParams);
  };

  return (
    <>
      <div className="controls">
        <div aria-live="polite">
          {searchQuery && <p>Showing: "{searchQuery}"</p>}

          {!loading && (
            <p>
              {sortedMovies.length}{' '}
              {sortedMovies.length === 1 ? 'movie' : 'movies'} loaded
            </p>
          )}
        </div>

        <div>
          <label htmlFor="sortSelect">Sort by:</label>

          <select
            id="sortSelect"
            value={sortBy}
            onChange={handleSortChange}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div
          className="movies-grid"
          aria-busy="true"
          aria-label="Loading movies"
        >
          {Array.from({ length: MOVIES_PER_PAGE }, (_, index) => (
            <MovieCard
              key={`skeleton-${index}`}
              isLoading
            />
          ))}
        </div>
      ) : paginatedMovies.length > 0 ? (
        <>
          <div className="movies-grid">
            {paginatedMovies.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                isLoading={false}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              aria-label="Movie result pages"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                marginTop: '40px',
                marginBottom: '20px',
              }}
            >
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                style={getPageButtonStyle(
                  false,
                  currentPage === 1
                )}
              >
                ← Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  aria-label={`Page ${page}`}
                  aria-current={
                    currentPage === page ? 'page' : undefined
                  }
                  style={getPageButtonStyle(
                    currentPage === page,
                    false
                  )}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={getPageButtonStyle(
                  false,
                  currentPage === totalPages
                )}
              >
                Next →
              </button>
            </nav>
          )}
        </>
      ) : (
        <div
          role="status"
          style={{
            textAlign: 'center',
            padding: '40px',
            color: '#666',
          }}
        >
          <h2>No movies to display</h2>
          <p>
            Try a different search. If nothing loads, check
            your connection and API configuration.
          </p>
        </div>
      )}
    </>
  );
};

const getPageButtonStyle = (active, disabled) => ({
  padding: '10px 14px',
  border: 'none',
  borderRadius: '8px',
  background: disabled ? '#333' : active ? '#555' : '#000',
  color: disabled ? '#999' : '#fff',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontWeight: active ? '700' : '600',
});

export default Home;