import { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
export const MainView = () => {
    const [movies, setMovies] = useState([
        {
            id: 1,
            title: "Talladega Knight: The Ballad of Ricky Bobby",
            image: "https://m.media-amazon.com/images/I/91yzZRen9rL._AC_UL480_FMwebp_QL65_.jpg",
            description: "Description for Talladega Knights",
            genre: "Comedy",
            director: "Adam McKay"
        },
        {
            id: 2,
            title: "Shrek",
            image: "https://m.media-amazon.com/images/I/81WLefsqEML._AC_UY327_FMwebp_QL65_.jpg",
            description: "Description for Shrek",
            genre: "Comedy",
            director: "Andrew Adamson",
        },
        {
            id: 3,
            title: "Remember the Titans",
            image: "https://m.media-amazon.com/images/I/51XXB53YV8L._AC_UY327_FMwebp_QL65_.jpg",
            description: "Description for Remember the Titans",
            genre: "Sports Drama",
            director: "Boaz Yakin",
        },
    ]);

    const [selectedMovie, setSelectedMovie] = useState(null);

    if (selectedMovie) {
        return (
            <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
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