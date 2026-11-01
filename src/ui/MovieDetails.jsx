import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { fetchMovieById } from '../services/moviesApi';

const MovieDetails = () => {
  const { id } = useParams();
  const location = useLocation();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failedPosterUrl, setFailedPosterUrl] = useState(null);

  const backTo = location.state?.from || '/';

  useEffect(() => {
    let ignore = false;

    const loadMovieDetails = async () => {
      setLoading(true);
      setMovie(null);
      setFailedPosterUrl(null);

      try {
        const movieData = await fetchMovieById(id);

        if (!ignore) {
          setMovie(movieData);
        }
      } catch (error) {
        console.error('Error loading movie details:', error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadMovieDetails();

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div
        className="movie-details__container"
        aria-busy="true"
        aria-label="Loading movie details"
      >
        <div className="movie-details__back">
          <Link to={backTo} className="movie-details__back-link">
            ← Back
          </Link>
        </div>

        <div className="movie-details__content" aria-hidden="true">
          <div className="movie-details__poster--wrapper">
            <div className="movie-details__poster--skeleton"></div>

            <div className="movie-details__info--skeleton">
              <div className="movie-details__title--skeleton"></div>
              <div className="movie-details__info-line--skeleton"></div>
              <div className="movie-details__info-line--skeleton"></div>
              <div className="movie-details__info-line--skeleton"></div>
            </div>
          </div>

          <div className="movie-details__text--wrapper">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                className="movie-details__detail--skeleton"
                key={index}
              >
                <div className="movie-details__detail-title--skeleton"></div>
                <div className="movie-details__detail-text--skeleton"></div>
                <div className="movie-details__detail-text--skeleton"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-details__container">
        <div className="movie-details__back">
          <Link to={backTo} className="movie-details__back-link">
            ← Back
          </Link>
        </div>

        <h2>Movie details unavailable</h2>
        <p>
          We couldn’t load this movie. Please return to the results
          and try again.
        </p>
      </div>
    );
  }

  const posterUrl =
    movie.Poster && movie.Poster !== 'N/A'
      ? movie.Poster
      : null;

  const showPoster =
    posterUrl && posterUrl !== failedPosterUrl;

  const rating =
    movie.imdbRating && movie.imdbRating !== 'N/A'
      ? `${movie.imdbRating}/10`
      : 'Not available';

  const details = [
    { label: 'Genre', value: movie.Genre },
    { label: 'Director', value: movie.Director },
    { label: 'Writer', value: movie.Writer },
    { label: 'Actors', value: movie.Actors },
    { label: 'Plot', value: movie.Plot },
    { label: 'Language', value: movie.Language },
    { label: 'Awards', value: movie.Awards },
  ];

  return (
    <div className="movie-details__container">
      <div className="movie-details__back">
        <Link to={backTo} className="movie-details__back-link">
          ← Back
        </Link>
      </div>

      <div className="movie-details__content">
        <div className="movie-details__poster--wrapper">
          {showPoster ? (
            <img
              className="movie-details__poster"
              src={posterUrl}
              alt={`${movie.Title} poster`}
              onError={() => setFailedPosterUrl(posterUrl)}
            />
          ) : (
            <div className="movie-details__poster-placeholder">
              Movie Poster Not Available
            </div>
          )}

          <div className="movie-details__info">
            <h1 className="movie-details__title">
              {movie.Title}
            </h1>

            <p className="movie-details__year">
              Year: {movie.Year || 'Not available'}
            </p>

            <p className="movie-details__rating">
              Rating: {rating}
            </p>

            <p className="movie-details__released">
              Released:{' '}
              {movie.Released && movie.Released !== 'N/A'
                ? movie.Released
                : 'Not available'}
            </p>
          </div>
        </div>

        <div className="movie-details__text--wrapper">
          {details
            .filter(({ value }) => value && value !== 'N/A')
            .map(({ label, value }) => (
              <div
                className="movie-details__detail"
                key={label}
              >
                <h3>{label}</h3>
                <p>{value}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;