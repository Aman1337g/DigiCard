import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h2>
                <p className="text-gray-700 mb-6">You do not have permission to view this page.</p>
                <Link 
                    to="/" 
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                    Go to Home
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;