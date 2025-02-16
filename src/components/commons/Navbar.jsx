import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Logo and Hamburger Menu */}
        <div className="flex items-center">
          <button
            className="md:hidden text-white text-2xl focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`md:flex md:gap-6 md:static absolute top-16 left-0 w-full bg-gray-800 p-4 md:p-0 transition-all ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <Link to="/admin" className="block md:inline-block py-2 hover:text-gray-300">
            Admin
          </Link>
          <Link to="/guard" className="block md:inline-block py-2 hover:text-gray-300">
            Guard
          </Link>
          <Link to="/student" className="block md:inline-block py-2 hover:text-gray-300">
            Student
          </Link>
          <Link to="/faculty" className="block md:inline-block py-2 hover:text-gray-300">
            Faculty
          </Link>
          <Link to="/staff" className="block md:inline-block py-2 hover:text-gray-300">
            Staff
          </Link>
          <Link to="/visitor" className="block md:inline-block py-2 hover:text-gray-300">
            Visitor
          </Link>
        </div>

        {/* Login/Logout Button */}
        <div>
          {user ? (
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
