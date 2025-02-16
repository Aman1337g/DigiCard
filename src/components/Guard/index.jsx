import React, { useState, useEffect } from "react";

const Guard = () => {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        setRequests(JSON.parse(localStorage.getItem("requests")) || []);
    }, []);

    const handleApprove = (username) => {
        const updatedRequests = requests.filter(req => req.username !== username);
        setRequests(updatedRequests);
        localStorage.setItem("requests", JSON.stringify(updatedRequests));

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex(u => u.username === username);
        if (userIndex !== -1) {
            users[userIndex].status = users[userIndex].status === "in" ? "out" : "in";
            localStorage.setItem("users", JSON.stringify(users));
        }

        alert("Request approved!");
    };

    const handleReject = (username) => {
        const updatedRequests = requests.filter(req => req.username !== username);
        setRequests(updatedRequests);
        localStorage.setItem("requests", JSON.stringify(updatedRequests));

        alert("Request rejected!");
    };

    const filteredRequests = filter === "all" ? requests : requests.filter(r => r.role === filter);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-6">Guard Panel</h2>
            <label className="mb-4 text-gray-700 font-bold">Filter by role:
                <select 
                    className="ml-2 p-2 border border-gray-300 rounded-lg" 
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="staff">Staff</option>
                    <option value="visitor">Visitor</option>
                </select>
            </label>

            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
                {filteredRequests.length > 0 ? (
                    <ul>
                        {filteredRequests.map((req, index) => (
                            <li key={index} className="flex justify-between items-center p-2 border-b border-gray-300">
                                <span>{req.username} - {req.role} - {req.requestType}</span>
                                <div>
                                    <button 
                                        onClick={() => handleApprove(req.username)} 
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded mr-2"
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleReject(req.username)} 
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-600 py-4">No requests at the moment.</p>
                )}
            </div>
        </div>
    );
};

export default Guard;
