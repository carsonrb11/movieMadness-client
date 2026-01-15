import { useEffect, useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import PropTypes from "prop-types";

// If you want a default, you can import MovieCard here and use it as fallback.
// import { MovieCard } from "../movie-card/movie-card";

export const ProfileView = ({
    user,
    token,
    movies,
    MovieCardComponent, // pass in MovieCard (component type)
    onUserUpdate,
    onDeregister
}) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteing, setDeleting] = useState(false);

    // Fetch user profile (includes FavoriteMovies array)
    useEffect(() => {
        if (!user || !token) return;

        setLoading(true);

        fetch(`https://movie-madness-6651c785b11e.herokuapp.com/users/${user.Username}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => res.json())
            .then((data) => {
                setProfile({
                    ...data,
                    Birthday: data.Birthday ? String(data.Birthday).substring(0, 10) : ""
                });
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [user, token]);

    // Build favorite movie objects from IDs
    const favoriteMovieIds = useMemo(() => {
        const ids = profile?.FavoriteMovies ?? user?.FavoriteMovies ?? [];
        return new Set(ids.map(String));
    }, [profile, user]);

    const favoriteMovies = useMemo(() => {
        if (!Array.isArray(movies)) return [];
        return movies.filter((m) => favoriteMovieIds.has(String(m.id)));
    }, [movies, favoriteMovieIds]);

    if (loading) return <div>Loading profile...</div>;
    if (!profile) return <div>Unable to load profile.</div>;

    const handleUpdate = (e) => {
        e.preventDefault();

        const payload = {
            Username: profile.Username,
            Password: profile.Password, // required by your PUT validation
            Email: profile.Email,
            Birthday: profile.Birthday
        };

        fetch(`https://movie-madness-6651c785b11e.herokuapp.com/users/${profile.Username}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })
            .then((res) => res.json())
            .then((updatedUser) => {
                localStorage.setItem("user", JSON.stringify(updatedUser));
                onUserUpdate(updatedUser);
                setProfile((p) => ({ ...p, ...updatedUser }));
                alert("Profile updated.");
            })
            .catch(() => alert("Update failed."));
    };

    const handleDeregister = async () => {
        const confirmed = window.confirm(
            "This will permanently delete your account. This cannot be undone. Continue?"
        );
        if (!confirmed) return;

        setDeleting(true);

        try {
            const res = await fetch(
                `https://movie-madness-6651c785b11e.herokuapp.com/users/${user.Username}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (!res.ok) {
                const msg = await res.text().catch(() => "");
                throw new Error(msg || "Delete failed");
            }

            // account deleted, now log out locally
            localStorage.clear();
            onDeregister?.(); // parent will set user/token null and route away
            alert("Account deleted.");
        } catch (e) {
            console.error(e);
            alert("Unable to delete account.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="profile-view">
            <h2>Your Profile</h2>

            <div><strong>Username:</strong> {profile.Username}</div>
            <div><strong>Email:</strong> {profile.Email}</div>
            <div><strong>Birthday:</strong> {profile.Birthday}</div>

            <h3 className="mt-4">Favorite Movies</h3>

            {favoriteMovies.length === 0 ? (
                <div>No favorites yet.</div>
            ) : (
                <div className="d-flex flex-wrap gap-3">
                    {favoriteMovies.map((movie) => (
                        <div style={{ width: 250 }} key={movie.id}>
                            <MovieCardComponent
                                movie={movie}
                                onMovieClick={() => { }} // satisfy current MovieCard propTypes
                            />
                        </div>
                    ))}
                </div>
            )}

            <h3 className="mt-4">Update Account</h3>

            <Form onSubmit={handleUpdate}>
                <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type="password"
                        minLength="8"
                        required
                        onChange={(e) => setProfile({ ...profile, Password: e.target.value })}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={profile.Email || ""}
                        required
                        onChange={(e) => setProfile({ ...profile, Email: e.target.value })}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Birthday</Form.Label>
                    <Form.Control
                        type="date"
                        value={profile.Birthday || ""}
                        required
                        onChange={(e) => setProfile({ ...profile, Birthday: e.target.value })}
                    />
                </Form.Group>

                <Button type="submit">Save Changes</Button>
            </Form>

            <hr className="my-4" />

            <h3>Danger Zone</h3>
            <Button
                variant="danger"
                onClick={handleDeregister}
                disabled={deleting}
            >
                {deleting ? "Deleting..." : "Deregister (Delete Account)"}
            </Button>
        </div>
    );
};
