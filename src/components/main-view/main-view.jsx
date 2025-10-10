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
                    title: movie.title,
                    description: movie.description,
                    image: movie.image,
                    director: movie.director.name,
                    bio: movie.director.bio,
                    birth: movie.director.birth,
                    death: movie.director.death,
                    genre: movie.genre.name,
                    featured: movie.featured
                }));
                setMovies(moviesFromApi);
            });
    }, []);

    if (selectedMovie) {
        let similarMovies = movies.filter((movie) => {
            //logic
            return movie.genre.name === selectedMovie.genre.name && movie.id !== selectedMovie.id;
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