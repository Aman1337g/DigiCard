import React, { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(UserContext);

    const handleSubmit = (e) => {
        e.preventDefault();

        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Check if admin login
        if (username === "admin" && password === "admin") {
            login(username, "admin", "admin");  // Admin role
            return;
        }

        // Check if user exists in localStorage
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            login(user.username, user.password, user.role);
        } else {
            alert("Invalid username or password!");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
