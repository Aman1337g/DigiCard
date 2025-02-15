import React, { useState } from "react";

const Admin = () => {
    const [users, setUsers] = useState(JSON.parse(localStorage.getItem("users")) || []);
    const [newUser, setNewUser] = useState({ 
        username: "", 
        password: "", 
        role: "student", 
        status: "in" 
    });

    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleAddUser = () => {
        if (!newUser.username.trim() || !newUser.password.trim()) return alert("Fields cannot be empty!");

        const updatedUsers = [...users, newUser];
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
        alert("User added successfully!");
    };

    const handleDeleteUser = (username) => {
        const updatedUsers = users.filter(user => user.username !== username);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        setUsers(updatedUsers);

        const requests = JSON.parse(localStorage.getItem("requests")) || [];
        const updatedRequests = requests.filter(req => req.username !== username);
        localStorage.setItem("requests", JSON.stringify(updatedRequests));

        alert("User and all related requests deleted!");
    };

    return (
        <div>
            <h2>Admin Panel</h2>
            <input type="text" name="username" placeholder="Enter Username" onChange={handleChange} />
            <input type="password" name="password" placeholder="Enter Password" onChange={handleChange} />
            
            <label>Role:</label>
            <select name="role" onChange={handleChange}>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="staff">Staff</option>
                <option value="visitor">Visitor</option>
                <option value="guard">Guard</option>
            </select>

            <label>Status:</label>
            <select name="status" onChange={handleChange}>
                <option value="in">In</option>
                <option value="out">Out</option>
            </select>

            <button onClick={handleAddUser}>Add User</button>

            <h3>Existing Users:</h3>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>
                        {user.username} - {user.role} - {user.status}
                        <button onClick={() => handleDeleteUser(user.username)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Admin;
