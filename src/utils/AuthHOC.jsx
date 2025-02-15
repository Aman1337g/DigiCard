import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const AuthHOC = ({ Component, allowedRoles }) => {
    const { user } = useContext(UserContext);

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" />;
    }

    return <Component />; // Fix: Ensure it's rendered as a JSX element
};

export default AuthHOC;
