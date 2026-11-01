const API_KEY = process.env.REACT_APP_OMDB_API_KEY || '6ab91971';
const BASE_URL = 'http://www.omdbapi.com/';

export const DEFAULT_MOVIE_IDS = [
  'tt3896198', // Guardians of the Galaxy Vol. 2
  'tt0111161', // The Shawshank Redemption
  'tt0068646', // The Godfather
  'tt0071562', // The Godfather Part II
  'tt0468569', // The Dark Knight
  'tt0110912', // Pulp Fiction
  'tt0816692', // Interstellar
  'tt1375666', // Inception
  'tt0108052', // Forrest Gump
  'tt0137523', // Fight Club
  'tt0120737', // Titanic
];

export const fetchMovieById = async (imdbID) => {
  try {
    const response = await fetch(
      `${BASE_URL}?i=${imdbID}&apikey=${API_KEY}&type=movie`
    );
    const data = await response.json();
    
    if (data.Response === 'True') {
      return data;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching movie ${imdbID}:`, error);
    return null;
  }
};

export const fetchMoviesBySearch = async (searchTerm) => {
  try {
    const response = await fetch(
      `${BASE_URL}?s=${searchTerm}&apikey=${API_KEY}&type=movie`
    );
    const data = await response.json();
    
    if (data.Response === 'True') {
      // Fetch full details for each search result
      const moviePromises = data.Search.map((movie) =>
        fetchMovieById(movie.imdbID)
      );
      const movies = await Promise.all(moviePromises);
      return movies.filter((movie) => movie !== null);
    }
    return [];
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};