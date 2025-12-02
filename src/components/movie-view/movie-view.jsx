import PropTypes from "prop-types";

export const MovieView = ({ movie, onBackClick }) => {
    return (
        <div>
            <div>
                <img className="w-100" src={movie.image} alt={movie.title} />
            </div>
            <div>
                <span>Title: </span>
                <span>{movie.title}</span>
            </div>
            <div>
                <span>Genre: </span>
                <span>{movie.genre.name}</span>
            </div>
            <div>
                <span>Description: </span>
                <span>{movie.description}</span>
            </div>
            <div>
                <span>Director: </span>
                <span>{movie.director.name}</span>
            </div>
            <button onClick={onBackClick}>Back</button>
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