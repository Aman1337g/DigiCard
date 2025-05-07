import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [requestStats, setRequestStats] = useState(null);
  const [activeTab, setActiveTab] = useState("users");
  const [isLoading, setIsLoading] = useState(false);
  const [offenders, setOffenders] = useState([]);

  // Cloudinary setup
  const cloudinaryUrl = import.meta.env.VITE_APP_CLOUDINARY_URL;
  const cloudinaryUploadPreset = import.meta.env
    .VITE_APP_CLOUDINARY_UPLOAD_PRESET;

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [usersRes, statsRes, requestsRes, offendersRes] =
          await Promise.all([
            fetch("https://digicard-backend-fgfe.onrender.com/api/users"),
            fetch("https://digicard-backend-fgfe.onrender.com/api/userstats").catch(() => ({
              ok: false,
            })),
            fetch("https://digicard-backend-fgfe.onrender.com/api/requeststats").catch(() => ({
              ok: false,
            })),
            fetch("https://digicard-backend-fgfe.onrender.com/api/students/offenders"),
          ]);

        const usersData = await usersRes.json();
        setUsers(usersData);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setUserStats(statsData);
        }

        if (requestsRes.ok) {
          const requestsData = await requestsRes.json();
          setRequestStats(requestsData);
        }

        const offendersData = await offendersRes.json();
        setOffenders(offendersData);
      } catch (err) {
        console.error("Error fetching data:", err);
        alert("Error connecting to server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleClearOffences = async (username) => {
    try {
      const res = await fetch(
        `https://digicard-backend-fgfe.onrender.com/api/students/${username}/clear-offences`,
        {
          method: "PATCH",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setOffenders((prev) => prev.filter((o) => o.username !== username));
        alert(`Offences cleared for ${username}`);
      } else {
        alert(data.error || "Failed to clear offences");
      }
    } catch (err) {
      console.error("Error clearing offences:", err);
      alert("Error connecting to server");
    }
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
      const res = await fetch("https://digicard-backend-fgfe.onrender.com/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userWithDummyData),
      });

      const data = await res.json();

      if (res.ok) {
        setUsers((prev) => [...prev, data]);
        setNewUser({
          username: "",
          password: "",
          role: "student",
          status: "in",
          phone: "",
          image: "",
        });
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
    if (!window.confirm(`Are you sure you want to delete ${username}?`)) return;

    try {
      const res = await fetch(`https://digicard-backend-fgfe.onrender.com/api/users/${username}`, {
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(
        `https://digicard-backend-fgfe.onrender.com/api/usersearch?query=${searchQuery}`
      );
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Error searching users:", err);
      alert("Error searching users");
    }
  };

  const sendAlertToAll = async () => {
    if (!window.confirm("Send alert to all users who are out/visitors in?"))
      return;

    try {
      const res = await fetch("https://digicard-backend-fgfe.onrender.com/api/alert", {
        method: "POST",
      });
      const data = await res.json();
      alert(data.message || "Alerts sent successfully!");
    } catch (err) {
      console.error("Error sending alerts:", err);
      alert("Failed to send alerts");
    }
  };

  const processedData = userStats?.byRole.map((item) => ({
    ...item,
    count: Number(item.count),
  }));

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

        {/* Tab Navigation */}
        <div className="flex mb-6 border-b">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "users"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("users")}
          >
            User Management
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "stats"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("stats")}
          >
            Statistics
          </button>
          <button
            className="ml-auto bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
            onClick={sendAlertToAll}
          >
            Send Campus Alert
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : activeTab === "users" ? (
          <>
            {/* Search Section */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Search Users</h3>
              <div className="flex gap-2">
                <input
                  className="border p-2 rounded flex-grow"
                  type="text"
                  placeholder="Search by username, role, status, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">
                    Search Results ({searchResults.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {searchResults.map((user, index) => (
                      <div
                        key={index}
                        className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center border"
                      >
                        <h4 className="text-lg font-semibold">
                          {user.username}
                        </h4>
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
              )}
            </div>
            {/* User with offences List */}
            <div className="my-8 bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">
                Students with Offences ({offenders.length})
              </h3>

              {offenders.length === 0 ? (
                <p className="text-gray-500">
                  No students with multiple offences found
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4 border">Username</th>
                        <th className="py-2 px-4 border">Name</th>
                        <th className="py-2 px-4 border">Offences</th>
                        <th className="py-2 px-4 border">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {offenders.map((student, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? "bg-gray-50" : ""}
                        >
                          <td className="py-2 px-4 border">
                            {student.username}
                          </td>
                          <td className="py-2 px-4 border">{student.name}</td>
                          <td className="py-2 px-4 border text-center">
                            {student.offences}
                          </td>
                          <td className="py-2 px-4 border">
                            <div className="flex gap-2 justify-center">
                              <button
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700 transition text-sm"
                                onClick={() =>
                                  handleClearOffences(student.username)
                                }
                              >
                                Clear
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {/* Add User Form */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-lg font-semibold mb-4">Add New User</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    type="text"
                    name="username"
                    value={newUser.username}
                    placeholder="Enter Username"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    type="password"
                    name="password"
                    value={newUser.password}
                    placeholder="Enter Password"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    type="text"
                    name="phone"
                    value={newUser.phone}
                    placeholder="Enter Phone Number"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    className="w-full border p-2 rounded"
                    name="role"
                    value={newUser.role}
                    onChange={handleChange}
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="staff">Staff</option>
                    <option value="visitor">Visitor</option>
                    <option value="guard">Guard</option>
                    <option value="warden">Warden</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full border p-2 rounded"
                    name="status"
                    value={newUser.status}
                    onChange={handleChange}
                  >
                    <option value="in">In</option>
                    <option value="out">Out</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={handleAddUser}
              >
                Add User
              </button>
              {newUser.image && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Selected Image Preview:
                  </p>
                  <img
                    src={newUser.image}
                    alt="Preview"
                    className="mt-2 w-20 h-20 rounded-full object-cover"
                  />
                </div>
              )}
            </div>
            {/* Existing Users List */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">
                Existing Users ({users.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {users.map((user, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg border flex flex-col items-center"
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
                      className="mt-2 w-20 h-20 rounded-full object-cover"
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
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-6">Campus Statistics</h3>

            {userStats && (
              <>
                <div className="mb-8">
                  <h4 className="text-lg font-medium mb-4">
                    User Distribution
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">By Role</h5>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={processedData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                              nameKey="role"
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {userStats.byRole.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">By Status</h5>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={userStats.byStatus}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="status" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" name="Users" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded border border-blue-100">
                      <h5 className="font-medium text-blue-800">
                        Currently In Campus
                      </h5>
                      <p className="text-2xl font-bold">
                        {userStats.inCampus?.in_count || 0}
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded border border-red-100">
                      <h5 className="font-medium text-red-800">
                        Currently Out
                      </h5>
                      <p className="text-2xl font-bold">
                        {userStats.inCampus?.out_count || 0}
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded border border-yellow-100">
                      <h5 className="font-medium text-yellow-800">
                        At Home (OOH)
                      </h5>
                      <p className="text-2xl font-bold">
                        {userStats.inCampus?.home_count || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {requestStats && (
              <div className="mt-8">
                <h4 className="text-lg font-medium mb-4">Request Statistics</h4>
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium mb-2">Requests by Type</h5>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={requestStats.byType}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#82ca9d" name="Requests" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium mb-2">
                    Daily Request Activity (Last 30 Days)
                  </h5>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-2 px-4 border">Date</th>
                          <th className="py-2 px-4 border">Total</th>
                          <th className="py-2 px-4 border">Approved</th>
                          <th className="py-2 px-4 border">Rejected</th>
                          <th className="py-2 px-4 border">Pending</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requestStats.daily.map((day, index) => (
                          <tr
                            key={index}
                            className={index % 2 === 0 ? "bg-gray-50" : ""}
                          >
                            <td className="py-2 px-4 border">
                              {new Date(day.date).toLocaleDateString()}
                            </td>
                            <td className="py-2 px-4 border text-center">
                              {day.total_requests}
                            </td>
                            <td className="py-2 px-4 border text-center">
                              {day.approved}
                            </td>
                            <td className="py-2 px-4 border text-center">
                              {day.rejected}
                            </td>
                            <td className="py-2 px-4 border text-center">
                              {day.pending}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
