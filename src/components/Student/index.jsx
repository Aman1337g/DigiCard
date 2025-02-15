import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";

const Student = () => {
    const { user } = useContext(UserContext);
    const [request, setRequest] = useState({ requestType: "out", purpose: "" });
    
    useEffect(() => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const currentUser = users.find(u => u.username === user.username);
        if (currentUser) {
            setRequest(prev => ({
                ...prev,
                requestType: currentUser.status === "in" ? "out" : "in"
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setRequest({ ...request, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!request.purpose.trim()) return alert("Purpose cannot be empty!");

        const userRequests = JSON.parse(localStorage.getItem("requests")) || [];
        userRequests.push({ username: user.username, role: "student", ...request });

        localStorage.setItem("requests", JSON.stringify(userRequests));
        alert("Request submitted!");
    };

    return (
        <div>
            <h2>Welcome, {user?.username} (Student)</h2>
            <form onSubmit={handleSubmit}>
                <label>Purpose: 
                    <input type="text" name="purpose" onChange={handleChange} required />
                </label>

                <p>Request Type: <b>{request.requestType}</b></p>

                <button type="submit">Submit Request</button>
            </form>
        </div>
    );
};

export default Student;
