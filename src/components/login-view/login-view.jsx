import { useState } from "react";
export const LoginView = ({ onLoggedIn }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            access: username,
            secret: password,
        };

        fetch("https://movie-madness-6651c785b11e.herokuapp.com/login", {
            method: "POST",
            body: JSON.stringify(data),
        }).then((response) => {
            if (response.ok) {
                onLoggedIn(username);
            } else {
                alert("Login Failed");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    minlength="8"
                    maxlength="20"
                    required
                />
            </label>
            <label>
                Password:
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minlength="8"
                    required
                />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
};
