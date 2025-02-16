import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const login = (username,role) => {
        if (role) {
            setUser({ username, role });
            navigate(`/${role}`);
        } else {
            alert("Invalid username.");
        }
    };

    const logout = () => {
        navigate("/login");
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
