import React, { useState, useEffect } from "react";

const Guard = () => {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        const storedRequests = JSON.parse(localStorage.getItem("requests")) || [];
        setRequests(storedRequests);
    }, []);

    const handleAction = (username, action) => {
        const updatedRequests = requests.filter(req => req.username !== username);
        localStorage.setItem("requests", JSON.stringify(updatedRequests));
        setRequests(updatedRequests);
        alert(`${username}'s request has been ${action}.`);
    };

    const filteredRequests = filter === "all" ? requests : requests.filter(req => req.role === filter);

    return (
        <div>
            <h2>Guard Panel</h2>
            <label>Filter by Role: 
                <select onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All</option>
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="staff">Staff</option>
                    <option value="visitor">Visitor</option>
                </select>
            </label>
            <div>
                {filteredRequests.length > 0 ? filteredRequests.map((req, index) => (
                    <div key={index} style={{ border: "1px solid black", padding: "10px", margin: "10px" }}>
                        <p><strong>User:</strong> {req.username} ({req.role})</p>
                        <p><strong>Request Type:</strong> {req.requestType}</p>
                        <p><strong>Timings:</strong> {req.timings}</p>
                        <p><strong>Purpose:</strong> {req.purpose}</p>
                        <button onClick={() => handleAction(req.username, "approved")}>Approve</button>
                        <button onClick={() => handleAction(req.username, "rejected")}>Reject</button>
                    </div>
                )) : <p>No requests found.</p>}
            </div>
        </div>
    );
};

export default Guard;
