import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { useParams, Link, Navigate } from "react-router-dom";
import "./movie-view.scss";

export const MovieView = ({ movies, user, token, onUserUpdate }) => {
    const { movieId } = useParams();
    const decodedId = decodeURIComponent(movieId);
    const movie = movies.find((m) => String(m.id) === String(decodedId));

    //For if movie has not loaded yet
    if (!movies || movies.length === 0) return <div>Loading movie...</div>;

    //If route is invalid, redirect to home
    if (!movie) return <Navigate to="/" replace />;

    const isFavorite = user?.FavoriteMovies?.includes(movie.id);

    const similarMovies = movies.filter(
        (m) => m.genre?.name === movie.genre?.name && m.id !== movie.id
    );

    const addToFavorites = () => {
        fetch(
            `https://movie-madness-6651c785b11e.herokuapp.com/users/${user.Username}/movies/${movie.id}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then((res) => res.json())
            .then((updatedUser) => {
                localStorage.setItem("user", JSON.stringify(updatedUser));
                onUserUpdate(updatedUser);
            })
            .catch(() => alert("Unable to add to favorites."));
    };

    const removeFromFavorites = () => {
        fetch(
            `https://movie-madness-6651c785b11e.herokuapp.com/users/${user.Username}/movies/${movie.id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then((res) => res.json())
            .then((updatedUser) => {
                localStorage.setItem("user", JSON.stringify(updatedUser));
                onUserUpdate(updatedUser);
            })
            .catch(() => alert("Unable to remove from favorites."));
    };
    return (
        <div className="movie-view">
            <div><img className="w-100" src={movie.image} alt={movie.title} /></div>

            <div><strong>Title:</strong> <span>{movie.title}</span></div>
            <div><strong>Genre:</strong> <span>{movie.genre.name}</span></div>
            <div><strong>Description:</strong> <span>{movie.description}</span></div>
            <div><strong>Director:</strong> <span>{movie.director.name}</span></div>

            {isFavorite ? (
                <Button variant="danger" className="mt-3" onClick={removeFromFavorites}>
                    Remove from Favorites
                </Button>
            ) : (
                <Button variant="primary" className="mt-3" onClick={addToFavorites}>
                    Add to Favorites
                </Button>
            )}

            <div className="mt-3">
                <Link to={`/`}>
                    <Button className="back-button mt-3">Back</Button>
                </Link>
            </div>

            <hr className="my-4" />

            <h2>Similar Movies</h2>

            {similarMovies.length === 0 ? (
                <div>No similar movies found.</div>
            ) : (
                <Row>
                    {similarMovies.map((m) => (
                        <Col className="mb-4" md={3} key={m.id}>
                            <MovieCard movie={m} onMovieClick={() => { }} />
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

MovieView.propTypes = {
    movie: PropTypes.array.isRequired,
    user: PropTypes.object,
    token: PropTypes.string,
    onUserUpdate: PropTypes.func.isRequired
}.isRequired
