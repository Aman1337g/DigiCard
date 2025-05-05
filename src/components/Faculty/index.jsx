import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";

const Faculty = () => {
  const { user } = useContext(UserContext);
  const [request, setRequest] = useState({ requestType: "out", purpose: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/users/${user.username}`);
        const data = await res.json();
        if (data?.status) {
          setRequest((prev) => ({
            ...prev,
            requestType: data.status === "in" ? "out" : "in",
          }));
        }
      } catch (err) {
        console.error("Error fetching user status:", err);
        alert("Failed to fetch user status.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.username) fetchStatus();
  }, [user]);

  const handleChange = (e) => {
    setRequest({ ...request, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!request.purpose.trim()) return alert("Purpose cannot be empty!");

    try {
      const res = await fetch(`http://localhost:3000/api/requests/${user.username}`);
      const data = await res.json();

      if (data && data.length > 0) {
        return alert("You already have a pending request!");
      }

      const submitRes = await fetch("http://localhost:3000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          role: "faculty",
          ...request,
        }),
      });

      if (submitRes.ok) {
        alert("Request submitted!");
        setRequest({ ...request, purpose: "" });
      } else {
        alert("Failed to submit request.");
      }
    } catch (err) {
      console.error("Error submitting request:", err);
      alert("Server error.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Welcome, {user?.username} (Faculty)
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Purpose:</label>
          <input
            type="text"
            name="purpose"
            value={request.purpose}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <p className="text-gray-700 font-bold">
            Request Type:{" "}
            <span className="text-blue-500">{request.requestType}</span>
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default Faculty;
