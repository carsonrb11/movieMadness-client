import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { SignupView } from "../signup-view/signup-view";
import { LoginView } from "../login-view/login-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

export const MainView = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
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

    return (
        <BrowserRouter>
            <NavigationBar user={user} onLoggedOut={() => {
                setUser(null);
                setToken(null);
                localStorage.clear();
            }}
            />
            <Row className="justify-content-md-center">
                <Routes>
                    <Route
                        path="/profile"
                        element={
                            !user ? (
                                <Navigate to="/login" replace />
                            ) : (
                                <Col md={10}>
                                    <ProfileView
                                        user={user}
                                        token={token}
                                        movies={movies}
                                        MovieCardComponent={MovieCard}
                                        onUserUpdate={(updatedUser) => setUser(updatedUser)}
                                    />
                                </Col>
                            )
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <>
                                {user ? (
                                    <Navigate to="/" />
                                ) : (
                                    <Col md={5}>
                                        <SignupView />
                                    </Col>
                                )}
                            </>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <>
                                {user ? (
                                    <Navigate to="/" />
                                ) : (
                                    <Col md={5}>
                                        <LoginView onLoggedIn={(user) => setUser(user)} />
                                    </Col>
                                )}
                            </>
                        }
                    />
                    <Route
                        path="/movies/:movieId"
                        element={
                            <>
                                {!user ? (
                                    <Navigate to="/login" replace />
                                ) : movies.length === 0 ? (
                                    <Col>The list is empty!</Col>
                                ) : (
                                    <Col md={8}>
                                        <MovieView
                                            movies={movies}
                                            user={user}
                                            token={token}
                                            onUserUpdate={(updatedUser) => setUser(updatedUser)}
                                        />
                                    </Col>
                                )}
                            </>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <>
                                {!user ? (
                                    <Navigate to="/login" replace />
                                ) : movies.length === 0 ? (
                                    <Col>The list is empty!</Col>
                                ) : (
                                    <>
                                        {movies.map((movie) => (
                                            <Col className="mb-4" md={3} key={movie.id}>
                                                <MovieCard movie={movie} />
                                            </Col>
                                        ))}
                                    </>
                                )}
                            </>
                        }
                    />
                </Routes>
            </Row>
        </BrowserRouter>
        // <Row className="justify-content-md-center">
        //     {!user ? (
        //         <Col md={5}>
        //             <LoginView onLoggedIn={(user, token) => {
        //                 setUser(user);
        //                 setToken(token);
        //             }} />
        //             or
        //             <SignupView />
        //         </Col>
        //     ) : selectedMovie ? (
        //         <>
        //             <button onClick={() => { setUser(null); setToken(null); localStorage.clear(); }}>Logout</button>
        //             <col md={8}>
        //                 <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
        //             </col>
        //             <hr />
        //             <h2>Similar Movies</h2>
        //             {movies
        //                 .filter(
        //                     (movie) =>
        //                         movie.genre.name === selectedMovie.genre.name && movie.id !== selectedMovie.id
        //                 )
        //                 .map((movie) => (
        //                     <Col className="mb-5" md={3} key={movie.id}>
        //                         <MovieCard
        //                             movie={movie}
        //                             onMovieClick={(newSelectedMovie) => {
        //                                 setSelectedMovie(newSelectedMovie);
        //                             }}
        //                         />
        //                     </Col>
        //                 ))}
        //         </>
        //     ) : movies.length === 0 ? (
        //         <>
        //             <button onClick={() => { setUser(null); setToken(null); localStorage.clear(); }}>Logout</button>
        //             <div>The list is empty! Sorry!</div>
        //         </>
        //     ) : (
        //         <>
        //             <button onClick={() => { setUser(null); setToken(null); localStorage.clear(); }}>Logout</button>
        //             {movies.map((movie) => (
        //                 <Col className="mb-5" md={3} key={movie.id}>
        //                     <MovieCard
        //                         movie={movie}
        //                         onMovieClick={(newSelectedMovie) => {
        //                             setSelectedMovie(newSelectedMovie);
        //                         }}
        //                     />
        //                 </Col>
        //             ))}
        //         </>
        //     )}
        // </Row>
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