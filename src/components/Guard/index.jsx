import React, { useEffect, useState } from "react";
import axios from "axios";

const Guard = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("approveRequests");

  const [newVisitor, setNewVisitor] = useState({
    username: "",
    password: "",
    role: "visitor",
    status: "in",
    phone: "",
    image: "",
  });

  // Cloudinary setup
  const cloudinaryUrl = import.meta.env.VITE_APP_CLOUDINARY_URL;
  const cloudinaryUploadPreset = import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET;

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/requests/pending");
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let intervalId;
  
    if (mode === "approveRequests") {
      fetchRequests(); // Initial fetch
      intervalId = setInterval(() => {
        fetchRequests();
      }, 60000); // 60 seconds
    }
  
    return () => {
      if (intervalId) clearInterval(intervalId); // Cleanup on unmount or mode change
    };
  }, [mode]);
  

  const handleRequestAction = async (username, action) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/requests/${username}/${action}`,
        {
          method: "PATCH",
        }
      );
      if (res.ok) {
        alert(`Request ${action}ed!`);
        fetchRequests();
      } else {
        alert("Failed to process the request.");
      }
    } catch (err) {
      console.error("Error handling request:", err);
    }
  };

  const sendAlert = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/alert", {
        method: "POST",
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error("Alert failed:", err);
      alert("Failed to send alerts.");
    }
  };

  const handleVisitorChange = (e) => {
    setNewVisitor({ ...newVisitor, [e.target.name]: e.target.value });
  };

  const handleVisitorImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", cloudinaryUploadPreset);

      try {
        const res = await axios.post(cloudinaryUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setNewVisitor({ ...newVisitor, image: res.data.secure_url });
      } catch (err) {
        console.error("Image upload error:", err);
        alert("Failed to upload image.");
      }
    }
  };

  const handleAddVisitor = async () => {
    if (
      !newVisitor.username.trim() ||
      !newVisitor.password.trim() ||
      !newVisitor.phone.trim()
    ) {
      return alert("All fields are required.");
    }

    try {
      const res = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newVisitor, name: newVisitor.username }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Visitor added successfully!");
        setNewVisitor({
          username: "",
          password: "",
          role: "visitor",
          status: "in",
          phone: "",
          image: "",
        });
      } else {
        alert(data.error || "Failed to add visitor.");
      }
    } catch (err) {
      console.error("Add visitor error:", err);
      alert("Server error while adding visitor.");
    }
  };

  const filteredRequests =
    filter === "all" ? requests : requests.filter((r) => r.role === filter);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Guard Panel</h2>

      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            mode === "approveRequests"
              ? "bg-blue-600 text-white"
              : "bg-white border text-gray-800"
          }`}
          onClick={() => setMode("approveRequests")}
        >
          Approve Requests
        </button>
        <button
          className={`px-4 py-2 rounded ${
            mode === "addVisitor"
              ? "bg-blue-600 text-white"
              : "bg-white border text-gray-800"
          }`}
          onClick={() => setMode("addVisitor")}
        >
          Create Visitor ID
        </button>
      </div>

      {mode === "approveRequests" && (
        <>
          <button
            onClick={sendAlert}
            className="mb-6 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
          >
            Alert all Students and Visitors
          </button>

          <div className="mb-6">
            <label className="text-gray-700 font-semibold">
              Filter by role:
              <select
                className="ml-2 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="staff">Staff</option>
                <option value="visitor">Visitor</option>
              </select>
            </label>
          </div>

          <div className="w-full max-w-xl space-y-4">
            {loading ? (
              <p>Loading...</p>
            ) : filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white shadow-lg rounded-lg p-4 border flex flex-col items-center"
                >
                  <img
                    src={req.image || "https://via.placeholder.com/150"}
                    alt="User"
                    className="w-24 h-24 rounded-full object-cover border mb-4"
                  />
                  <p className="text-gray-800 font-medium text-center">
                    <span className="font-bold">{req.username}</span>, a{" "}
                    <span className="text-blue-600 font-bold">{req.role}</span>, requested to{" "}
                    <span className="font-bold text-green-600">
                      {req.type === "in" ? "come in" : "go out"}
                    </span>{" "}
                    for {req.purpose}.
                  </p>
                  <div className="mt-3 flex justify-center space-x-3">
                    <button
                      onClick={() => handleRequestAction(req.username, "approve")}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRequestAction(req.username, "reject")}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 py-4">No requests at the moment.</p>
            )}
          </div>
        </>
      )}

      {mode === "addVisitor" && (
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
          <h3 className="text-xl font-semibold mb-4 text-center">Create Visitor ID</h3>
          <input
            className="w-full border p-2 rounded mb-3"
            type="text"
            name="username"
            placeholder="Enter Username"
            value={newVisitor.username}
            onChange={handleVisitorChange}
          />
          <input
            className="w-full border p-2 rounded mb-3"
            type="password"
            name="password"
            placeholder="Enter Password"
            value={newVisitor.password}
            onChange={handleVisitorChange}
          />
          <input
            className="w-full border p-2 rounded mb-3"
            type="text"
            name="phone"
            placeholder="Enter Phone Number"
            value={newVisitor.phone}
            onChange={handleVisitorChange}
          />
          <label className="block mb-2 font-semibold">Image:</label>
          <input
            className="w-full border p-2 rounded mb-4"
            type="file"
            accept="image/*"
            onChange={handleVisitorImage}
          />
          <button
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleAddVisitor}
          >
            Add Visitor
          </button>
        </div>
      )}
    </div>
  );
};

export default Guard;
