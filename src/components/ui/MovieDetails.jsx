import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMovieById } from '../services/moviesApi';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovieDetails();
  }, [id]);

  const loadMovieDetails = async () => {
    setLoading(true);
    try {
      const movieData = await fetchMovieById(id);
      setMovie(movieData);
    } catch (error) {
      console.error('Error loading movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="main">
        <div className="movie-details__container">
          <div className="movie-details__back">
            <div className="movie-details__back-link" style={{ height: '20px', width: '60px', background: '#e0e0e0', borderRadius: '4px' }}></div>
          </div>
          <div className="movie-details__content">
            <div className="movie-details__poster--wrapper">
              <div className="movie-details__poster--skeleton"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="main">
        <div className="movie-details__container">
          <Link to="/" className="movie-details__back-link">← Back</Link>
          <h2>Movie not found</h2>
        </div>
      </main>
    );
  }

  const posterUrl = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : null;

  return (
    <main className="main">
      <div className="movie-details__container">
        <div className="movie-details__back">
          <Link to="/" className="movie-details__back-link">← Back</Link>
        </div>

        <div className="movie-details__content">
          {/* Left Side - Poster & Info */}
          <div className="movie-details__poster--wrapper">
            {posterUrl ? (
              <img
                className="movie-details__poster"
                src={posterUrl}
                alt={movie.Title}
              />
            ) : (
              <div className="movie-details__poster-placeholder">
                No Poster Available
              </div>
            )}
            
            <h1 className="movie-details__title">{movie.Title}</h1>
            <p className="movie-details__year">Year: {movie.Year}</p>
            <p className="movie-details__rating">Rating: {movie.imdbRating}/10</p>
            <p className="movie-details__released">Released: {movie.Released}</p>
          </div>

          {/* Right Side - Details */}
          <div className="movie-details__text--wrapper">
            {movie.Genre && movie.Genre !== 'N/A' && (
              <div className="movie-details__detail">
                <h3>Genre</h3>
                <p>{movie.Genre}</p>
              </div>
            )}

            {movie.Director && movie.Director !== 'N/A' && (
              <div className="movie-details__detail">
                <h3>Director</h3>
                <p>{movie.Director}</p>
              </div>
            )}

            {movie.Writer && movie.Writer !== 'N/A' && (
              <div className="movie-details__detail">
                <h3>Writer</h3>
                <p>{movie.Writer}</p>
              </div>
            )}

            {movie.Actors && movie.Actors !== 'N/A' && (
              <div className="movie-details__detail">
                <h3>Actors</h3>
                <p>{movie.Actors}</p>
              </div>
            )}

            {movie.Plot && movie.Plot !== 'N/A' && (
              <div className="movie-details__detail">
                <h3>Plot</h3>
                <p>{movie.Plot}</p>
              </div>
            )}

            {movie.Language && movie.Language !== 'N/A' && (
              <div className="movie-details__detail">
                <h3>Language</h3>
                <p>{movie.Language}</p>
              </div>
            )}

            {movie.Awards && movie.Awards !== 'N/A' && (
              <div className="movie-details__detail">
                <h3>Awards</h3>
                <p>{movie.Awards}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MovieDetails;