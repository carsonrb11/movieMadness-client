import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
export const MainView = () => {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch("https://movie-madness-6651c785b11e.herokuapp.com/movies")
            .then((response) => response.json())
            .then((data) => {
                const moviesFromApi = data.map((movie) => ({
                    id: movie._id,
                    title: movie.Title || movie.title,
                    description: movie.Description || movie.description,
                    image: movie.ImagePath || movie.image,
                    director: movie.Director?.Name || movie.director?.name || movie.director || "Unknown Director",
                    bio: movie.Director?.Bio || movie.director?.bio || "No bio available",
                    birth: movie.Director?.Birth || movie.director?.birth || "",
                    death: movie.Director?.Death || movie.director?.death || "",
                    genre: movie.Genre?.Name || movie.genre?.name || movie.genre || "Unknown Genre",
                    featured: movie.Featured || movie.featured || false
                }));
                setMovies(moviesFromApi);
            });
    }, []);

    if (!user) {
        return <LoginView onLoggedIn={(user) => setUser(user)} />;
    }

    if (selectedMovie) {
        let similarMovies = movies.filter((movie) => {
            //logic
            return movie.genre === selectedMovie.genre && movie.id !== selectedMovie.id;
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

//MainView does not currently receive any props:
MainView.propTypes = {};