import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";

const Staff = () => {
  const { user } = useContext(UserContext);
  const [request, setRequest] = useState({ requestType: "out", purpose: "" });
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState(null);
  useEffect(() => {
    let interval;

    const fetchStatus = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/users/${user.username}`
        );
        const data = await res.json();
        if (data?.status) {
          setUserStatus(data.status);
          setRequest((prev) => ({
            ...prev,
            requestType: data.status === "in" ? "out" : "in",
          }));
        }
      } catch (err) {
        console.error("Error fetching user status:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.username) {
      fetchStatus(); // initial call
      interval = setInterval(fetchStatus, 10000); // every 10 seconds
    }

    return () => clearInterval(interval); // cleanup on unmount
  }, [user]);

  const handleChange = (e) => {
    setRequest({ ...request, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!request.purpose.trim()) return alert("Purpose cannot be empty!");

    try {
      const res = await fetch(
        `http://localhost:3000/api/requests/${user.username}`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        return alert("You already have a pending request!");
      }

      const submitRes = await fetch("http://localhost:3000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          image: user.image,
          role: "staff",
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
      <div className="w-24 rounded-full overflow-hidden">
        <img src={user?.image} alt="User" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Welcome, {user?.username} (Staff)
      </h2>
      <div className="overflow-hidden w-full max-w-md h-10">
        <h3
          className={`animate-slidein-pulse text-base font-semibold text-center ${
            userStatus === "in"
              ? "text-blue-600"
              : userStatus === "out"
              ? "text-green-600"
              : userStatus === "hostel"
              ? "text-orange-600"
              : "text-yellow-600"
          }`}
        >
          {userStatus === "in" && "You are allowed enter the campus."}
          {userStatus === "out" && "You are allowed to leave the campus."}
          {userStatus === "home" && "You are allowed to go home."}
        </h3>
      </div>
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

export default Staff;
