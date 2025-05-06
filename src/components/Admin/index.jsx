import React, { useState, useEffect } from "react";
import axios from "axios";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "student",
    status: "in",
    phone: "",
    image: "",
  });

  // Cloudinary setup
  const cloudinaryUrl = import.meta.env.VITE_APP_CLOUDINARY_URL;
  const cloudinaryUploadPreset = import.meta.env
    .VITE_APP_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users");
        const data = await res.json();
        if (res.ok) {
          setUsers(data);
        } else {
          alert(data.error || "Failed to fetch users.");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        alert("Error connecting to server.");
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", cloudinaryUploadPreset);

      try {
        const response = await axios.post(cloudinaryUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Get the URL of the uploaded image
        const imageUrl = response.data.secure_url;
        setNewUser({ ...newUser, image: imageUrl });
      } catch (err) {
        console.error("Error uploading image:", err);
        alert("Error uploading image.");
      }
    }
  };

  const handleAddUser = async () => {
    if (
      !newUser.username.trim() ||
      !newUser.password.trim() ||
      !newUser.phone.trim()
    ) {
      return alert("Fields cannot be empty!");
    }

    const userWithDummyData = {
      ...newUser,
      name: newUser.username,
    };

    try {
      const res = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userWithDummyData),
      });

      const data = await res.json();

      if (res.ok) {
        setUsers((prev) => [...prev, data]);
        alert("User added to database!");
      } else {
        alert(data.error || "Failed to add user.");
      }
    } catch (err) {
      console.error("Error during fetch:", err);
      alert("Error connecting to server.");
    }
  };

  const handleDeleteUser = async (username) => {
    try {
      const res = await fetch(`http://localhost:3000/api/users/${username}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user.username !== username));
        alert("User deleted successfully!");
      } else {
        alert(data.error || "Failed to delete user.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Error connecting to server.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        <div className="flex flex-col w-full md:w-1/2 lg:w-1/3 mx-auto gap-4 mb-6">
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
          <input
            className="border p-2 rounded"
            type="text"
            name="phone"
            placeholder="Enter Phone Number"
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
            <option value="warden">Warden</option>
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

          <label className="font-semibold">Image:</label>
          <input
            className="border p-2 rounded"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

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
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center border"
            >
              <h4 className="text-lg font-semibold">{user.username}</h4>
              <p className="text-gray-600">{user.role}</p>
              <span
                className={`mt-2 px-3 py-1 text-sm font-bold rounded-full ${
                  user.status === "in"
                    ? "bg-green-500 text-white"
                    : user.status === "home"
                    ? "bg-yellow-400 text-black"
                    : "bg-red-500 text-white"
                }`}
              >
                {user.status.toUpperCase()}
              </span>
              <img
                className="mt-2 w-20 h-20 rounded-full"
                src={user.image || "https://via.placeholder.com/150"}
                alt="User Avatar"
              />
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
