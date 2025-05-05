import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const navigate = useNavigate();

    // Load user from sessionStorage on initial load
    const [user, setUser] = useState(() => {
        const storedUser = sessionStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (username, role, image) => {
        if (role) {
            const userData = { username, role, image };
            setUser(userData);
            sessionStorage.setItem("user", JSON.stringify(userData));
            navigate(`/${role}`);
        } else {
            alert("Invalid username.");
        }
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
