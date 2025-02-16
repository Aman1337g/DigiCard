import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";

const Faculty = () => {
    const { user } = useContext(UserContext);
    const [request, setRequest] = useState({
        requestType: "out",
        purpose: "",
    });

    useEffect(() => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const currentUser = users.find(u => u.username === user.username);
        if (currentUser) {
            setRequest(prev => ({ ...prev, requestType: currentUser.status === "in" ? "out" : "in" }));
        }
    }, [user.username]);

    const handleChange = (e) => {
        setRequest({ ...request, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const userRequests = JSON.parse(localStorage.getItem("requests")) || [];
        userRequests.push({ username: user.username, role: "faculty", ...request });
        localStorage.setItem("requests", JSON.stringify(userRequests));
        alert("Request submitted!");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-6">Welcome, {user.username} (Faculty)</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Purpose:</label>
                    <input 
                        type="text" 
                        name="purpose" 
                        onChange={handleChange} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Type:</label>
                    <input 
                        type="text" 
                        value={request.requestType} 
                        disabled 
                        className="w-full p-2 border border-gray-300 bg-gray-100 rounded-lg"
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Submit Request
                </button>
            </form>
        </div>
    );
};

export default Faculty;
