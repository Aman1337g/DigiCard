import React, { useState } from "react";

const Admin = () => {
    const [users, setUsers] = useState(JSON.parse(localStorage.getItem("users")) || []);
    const [newUser, setNewUser] = useState({ username: "", role: "student" });

    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleAddUser = () => {
        if (!newUser.username.trim()) return alert("Username cannot be empty!");
        const updatedUsers = [...users, newUser];
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
        alert("User added successfully!");
    };

    return (
        <div>
            <h2>Admin Panel</h2>
            <input type="text" name="username" placeholder="Enter Username" onChange={handleChange} />
            <select name="role" onChange={handleChange}>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="staff">Staff</option>
                <option value="visitor">Visitor</option>
                <option value="guard">Guard</option>
            </select>
            <button onClick={handleAddUser}>Add User</button>

            <h3>Existing Users:</h3>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>{user.username} - {user.role}</li>
                ))}
            </ul>
        </div>
    );
};

export default Admin;
