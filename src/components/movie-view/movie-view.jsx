import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./movie-view.scss";

export const MovieView = ({ movies, user, token, onUserUpdate }) => {
    const { movieId } = useParams();
    const movie = movies.find((m) => m.id === movieId);
    const isFavorite = user?.FavoriteMovies?.includes(movie.id);

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

            <Link to={`/`}>
                <Button className="back-button mt-3">Back</Button>
            </Link>
        </div>
    );
};

MovieView.propTypes = {
    movie: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        image: PropTypes.string,
        director: PropTypes.shape({
            name: PropTypes.string.isRequired,
            bio: PropTypes.string.isRequired,
            birth: PropTypes.string.isRequired,
            death: PropTypes.string.isRequired
        }).isRequired,
        genre: PropTypes.shape({
            name: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired
        }).isRequired,
        featured: PropTypes.bool
    }).isRequired,
    onBackClick: PropTypes.func.isRequired
};