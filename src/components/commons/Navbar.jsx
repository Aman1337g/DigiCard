import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const Navbar = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex gap-6">
          <Link to="/admin" className="hover:text-gray-300">Admin</Link>
          <Link to="/guard" className="hover:text-gray-300">Guard</Link>
          <Link to="/student" className="hover:text-gray-300">Student</Link>
          <Link to="/faculty" className="hover:text-gray-300">Faculty</Link>
          <Link to="/staff" className="hover:text-gray-300">Staff</Link>
          <Link to="/visitor" className="hover:text-gray-300">Visitor</Link>
        </div>
        <div>
          {user ? (
            <button 
              onClick={logout} 
              className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded transition"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded transition">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
