import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie, isLoading }) => {
  if (isLoading) {
    return (
      <div className="movie-card movie-card--skeleton">
        <div className="movie-card__img--skeleton"></div>
        <div className="movie-card__title--skeleton"></div>
        <div className="movie-card__year--skeleton"></div>
      </div>
    );
  }

  if (!movie) {
    return null;
  }

  const posterUrl = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : null;

  return (
    <Link to={`/movie/${movie.imdbID}`} style={{ textDecoration: 'none' }}>
      <div className="movie-card">
        {posterUrl ? (
          <img
            className="movie-card__img"
            src={posterUrl}
            alt={movie.Title}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        {!posterUrl ? (
          <div className="movie-card__poster-placeholder">
            No Poster Available
          </div>
        ) : null}
        <h3 className="movie-card__title">{movie.Title}</h3>
        <p className="movie-card__year">{movie.Year}</p>
      </div>
    </Link>
  );
};

export default MovieCard;