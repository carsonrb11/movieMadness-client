import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
export const MainView = () => {
    const [movies, setMovies] = useState([]);

    const [selectedMovie, setSelectedMovie] = useState(null);
    useEffect(() => {
        fetch("https://movie-madness-6651c785b11e.herokuapp.com/movies")
            .then((response) => response.json())
            .then((data) => {
                const moviesFromApi = data.map((movie) => ({
                    id: movie._id,
                    title: movie.Title,
                    description: movie.Description,
                    image: movie.ImagePath,
                    director: movie.Director.Name,
                    bio: movie.Director.Bio,
                    birth: movie.Director.Birth,
                    death: movie.Director.Death,
                    genre: movie.Genre.Name,
                    featured: movie.Featured
                }));
                setMovies(moviesFromApi);
            });
    }, []);

    if (selectedMovie) {
        let similarMovies = movies.filter((movie, index) => {
            return movie === movie.Genre.Name//logic
        });
        return (
            <>
                <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
                <hr />
                <h2>Similar Movies</h2>
                {similarMovies.map((movie) => (
                    <MovieCard
                        key={movie.id}
                        movie={movie}
                        onMovieClick={(newSelectedMovie) => {
                            setSelectedMovie(newSelectedMovie)
                        }}
                    />
                ))}
            </>
        );
    }

    if (movies.length === 0) {
        return <div>The list is empty! Sorry!</div>
    } else {
        return (
            <div>
                {movies.map((movie) => (
                    <MovieCard
                        key={movie.id}
                        movie={movie}
                        onMovieClick={(newSelectedMovie) => {
                            setSelectedMovie(newSelectedMovie);
                        }}
                    />
                ))}
            </div>
        );
    }
};