import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { SignupView } from "../signup-view/signup-view";
import { LoginView } from "../login-view/login-view";
import { ProfileView } from "../profile-view/profile-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { Row, Col } from "react-bootstrap";
export const MainView = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    const [movies, setMovies] = useState([]);
    const [user, setUser] = useState(storedUser ? storedUser : null);
    const [token, setToken] = useState(storedToken ? storedToken : null);

    useEffect(() => {
        if (!token) {
            return;
        }

        fetch("https://movie-madness-6651c785b11e.herokuapp.com/movies", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => response.json())
            .then((data) => {
                const moviesFromApi = data.map((movie) => ({
                    id: movie._id,
                    title: movie.Title || movie.title,
                    description: movie.Description || movie.description,
                    image: movie.ImagePath || movie.image,
                    director: {
                        name: movie.Director?.Name || movie.director?.name || movie.director || "Unknown Director",
                        bio: movie.Director?.Bio || movie.director?.bio || "No bio available",
                        birth: movie.Director?.Birth || movie.director?.birth || "",
                        death: movie.Director?.Death || movie.director?.death || "",
                    },
                    genre: {
                        name: movie.Genre?.Name || movie.genre?.name || movie.genre || "Unknown Genre",
                        description: movie.Genre?.Description || movie.genre?.description || "No description available"
                    },
                    featured: movie.Featured || movie.featured || false
                }));
                setMovies(moviesFromApi);
            });
    }, [token]);

    const handleLoggedOut = () => {
        setUser(null);
        setToken(null);
        localStorage.clear();
    };

    return (
        <>
            <NavigationBar user={user} onLoggedOut={handleLoggedOut} />

            <Row className="justify-content-md-center">
                <Routes>
                    {/* Home: list of movies */}
                    <Route
                        path="/"
                        element={
                            !user ? (
                                <Navigate to="/login" replace />
                            ) : movies.length === 0 ? (
                                <Col>The list is empty! Sorry!</Col>
                            ) : (
                                <>
                                    {movies.map((movie) => (
                                        <Col className="mb-5" md={3} key={movie.id}>
                                            <MovieCard movie={movie} onMovieClick={() => { }} />
                                        </Col>
                                    ))}
                                </>
                            )
                        }
                    />

                    {/* Movie details */}
                    <Route
                        path="/movies/:movieId"
                        element={
                            !user ? (
                                <Navigate to="/login" replace />
                            ) : (
                                <Col md={8}>
                                    <MovieView
                                        movies={movies}
                                        user={user}
                                        token={token}
                                        onUserUpdate={setUser}
                                    />
                                </Col>
                            )
                        }
                    />

                    {/* Profile */}
                    <Route
                        path="/profile"
                        element={
                            !user ? (
                                <Navigate to="/login" replace />
                            ) : (
                                <Col md={8}>
                                    <ProfileView
                                        user={user}
                                        token={token}
                                        movies={movies}
                                        MovieCardComponent={MovieCard}
                                        onUserUpdate={setUser}
                                        onDeregister={handleLoggedOut}
                                    />
                                </Col>
                            )
                        }
                    />

                    {/* Login */}
                    <Route
                        path="/login"
                        element={
                            user ? (
                                <Navigate to="/" replace />
                            ) : (
                                <Col md={5}>
                                    <LoginView
                                        onLoggedIn={(user, token) => {
                                            setUser(user);
                                            setToken(token);
                                        }}
                                    />
                                </Col>
                            )
                        }
                    />

                    {/* Signup */}
                    <Route
                        path="/signup"
                        element={
                            user ? (
                                <Navigate to="/" replace />
                            ) : (
                                <Col md={5}>
                                    <SignupView />
                                </Col>
                            )
                        }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Row>
        </>
    );
};

//     if (!user) {
//         return (
//             <>
//                 <LoginView onLoggedIn={(user, token) => {
//                     setUser(user);
//                     setToken(token);
//                 }} />
//                 or
//                 <SignupView />
//             </>
//         );
//     }

//     if (selectedMovie) {
//         let similarMovies = movies.filter((movie) => {
//             //logic
//             return movie.genre.name === selectedMovie.genre.name && movie.id !== selectedMovie.id;
//         });
//         return (
//             <>
//                 <button onClick={() => { setUser(null); setToken(null); localStorage.clear(); }}>Logout</button>
//                 <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
//                 <hr />
//                 <h2>Similar Movies</h2>
//                 {similarMovies.map((movie) => (
//                     <MovieCard
//                         key={movie.id}
//                         movie={movie}
//                         onMovieClick={(newSelectedMovie) => {
//                             setSelectedMovie(newSelectedMovie)
//                         }}
//                     />
//                 ))}
//             </>
//         );
//     }

//     if (movies.length === 0) {
//         return (
//             <>
//                 <button onClick={() => { setUser(null); setToken(null); localStorage.clear(); }}>Logout</button>
//                 <div>The list is empty! Sorry!</div>
//             </>
//         );
//     } else {
//         return (
//             <div>
//                 <button onClick={() => { setUser(null); setToken(null); localStorage.clear(); }}>Logout</button>
//                 {movies.map((movie) => (
//                     <MovieCard
//                         key={movie.id}
//                         movie={movie}
//                         onMovieClick={(newSelectedMovie) => {
//                             setSelectedMovie(newSelectedMovie);
//                         }}
//                     />
//                 ))}
//             </div>
//         );
//     }
// };

//MainView does not currently receive any props:
MainView.propTypes = {};