import React, { useState } from "react";

const Admin = () => {
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("users")) || []
  );
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "student",
    status: "in",
  });

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = () => {
    if (!newUser.username.trim() || !newUser.password.trim())
      return alert("Fields cannot be empty!");

    const updatedUsers = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    alert("User added successfully!");
  };

  const handleDeleteUser = (username) => {
    const updatedUsers = users.filter((user) => user.username !== username);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    const requests = JSON.parse(localStorage.getItem("requests")) || [];
    const updatedRequests = requests.filter((req) => req.username !== username);
    localStorage.setItem("requests", JSON.stringify(updatedRequests));

    alert("User and all related requests deleted!");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        <div className="flex flex-col gap-4 mb-6">
          <input
            className="border p-2 rounded"
            type="text"
            name="username"
            placeholder="Enter Username"
            onChange={handleChange}
          />
          <input
            className="border p-2 rounded"
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
          />

          <label className="font-semibold">Role:</label>
          <select
            className="border p-2 rounded"
            name="role"
            onChange={handleChange}
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="staff">Staff</option>
            <option value="visitor">Visitor</option>
            <option value="guard">Guard</option>
          </select>

          <label className="font-semibold">Status:</label>
          <select
            className="border p-2 rounded"
            name="status"
            onChange={handleChange}
          >
            <option value="in">In</option>
            <option value="out">Out</option>
          </select>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={handleAddUser}
          >
            Add User
          </button>
        </div>

        <h3 className="text-xl font-semibold mb-4">Existing Users:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {users.map((user, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center border">
              <h4 className="text-lg font-semibold">{user.username}</h4>
              <p className="text-gray-600">{user.role}</p>
              <span
                className={`mt-2 px-3 py-1 text-sm font-bold rounded-full ${
                  user.status === "in" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                }`}
              >
                {user.status.toUpperCase()}
              </span>
              <button
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                onClick={() => handleDeleteUser(user.username)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
