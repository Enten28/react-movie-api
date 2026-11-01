import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const MovieCard = ({ movie, isLoading }) => {
  const location = useLocation();
  const [failedPosterUrl, setFailedPosterUrl] = useState(null);

  if (isLoading) {
    return (
      <div
        className="movie-card movie-card--skeleton"
        aria-hidden="true"
      >
        <div className="movie-card__img--skeleton"></div>
        <div className="movie-card__title--skeleton"></div>
        <div className="movie-card__year--skeleton"></div>
      </div>
    );
  }

  if (!movie) {
    return null;
  }

  const posterUrl =
    movie.Poster && movie.Poster !== 'N/A'
      ? movie.Poster
      : null;

  const showPoster =
    posterUrl && posterUrl !== failedPosterUrl;

  return (
    <Link
      to={`/movie/${movie.imdbID}`}
      state={{
        from: `${location.pathname}${location.search}`,
      }}
    >
      <div className="movie-card">
        {showPoster ? (
          <img
            className="movie-card__img"
            src={posterUrl}
            alt={`${movie.Title} poster`}
            onError={() => setFailedPosterUrl(posterUrl)}
          />
        ) : (
          <div className="movie-card__poster-placeholder">
            Movie Poster Not Available
          </div>
        )}

        <h3 className="movie-card__title">
          {movie.Title}
        </h3>

        <p className="movie-card__year">
          {movie.Year}
        </p>
      </div>
    </Link>
  );
};

export default MovieCard;