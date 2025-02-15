import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const login = (username, password) => {
        const role = username.startsWith("admin")
            ? "admin"
            : username.startsWith("g")
            ? "guard"
            : username.startsWith("b") || username.startsWith("c")
            ? "student"
            : username.startsWith("s")
            ? "staff"
            : username.startsWith("f")
            ? "faculty"
            : username.startsWith("v")
            ? "visitor"
            : null;

        if (role) {
            setUser({ username, role });
            navigate(`/${role}`);
        } else {
            alert("Invalid username.");
        }
    };

    const logout = () => {
        setUser(null);
        navigate("/login");
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
