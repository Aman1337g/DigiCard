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
        <div>
            <h2>Guard Panel</h2>
            <label>Filter by role:
                <select onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All</option>
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="staff">Staff</option>
                    <option value="visitor">Visitor</option>
                </select>
            </label>

            <ul>
                {filteredRequests.map((req, index) => (
                    <li key={index}>
                        {req.username} - {req.role} - {req.requestType}
                        <button onClick={() => handleApprove(req.username)}>Approve</button>
                        <button onClick={() => handleReject(req.username)}>Reject</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Guard;
