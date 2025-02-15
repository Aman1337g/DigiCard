import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const Navbar = () => {
    const { user, logout } = useContext(UserContext);

    return (
        <nav style={{ padding: "10px", borderBottom: "1px solid black" }}>
            <Link to="/">Home</Link>
            {user ? (
                <>
                    {user.role === "admin" && <Link to="/admin">Admin</Link>}
                    {user.role === "guard" && <Link to="/guard">Guard</Link>}
                    {user.role === "student" && <Link to="/student">Student</Link>}
                    {user.role === "faculty" && <Link to="/faculty">Faculty</Link>}
                    {user.role === "staff" && <Link to="/staff">Staff</Link>}
                    {user.role === "visitor" && <Link to="/visitor">Visitor</Link>}
                    <button onClick={logout} style={{ marginLeft: "10px" }}>Logout</button>
                </>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </nav>
    );
};

export default Navbar;
