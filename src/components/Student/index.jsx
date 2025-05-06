import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";

const Student = () => {
  const { user } = useContext(UserContext);
  const [request, setRequest] = useState({ requestType: "out", purpose: "" });
  const [leave, setLeave] = useState({
    purpose: "",
    leaveDate: "",
    returnDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("gate");
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

  const handleRequestChange = (e) => {
    setRequest({ ...request, [e.target.name]: e.target.value });
  };

  const handleLeaveChange = (e) => {
    setLeave({ ...leave, [e.target.name]: e.target.value });
  };

  const handleRequestSubmit = async (e) => {
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
          role: "student",
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

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    const { purpose, leaveDate, returnDate } = leave;
    if (!purpose || !leaveDate || !returnDate) {
      return alert("Please fill all leave request fields.");
    }

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
          role: "student",
          requestType: "OOHostel",
          purpose: `${purpose} (From: ${leaveDate} To: ${returnDate})`,
        }),
      });

      if (submitRes.ok) {
        alert("Leave request submitted to warden!");
        setLeave({ purpose: "", leaveDate: "", returnDate: "" });
      } else {
        alert("Failed to submit leave request.");
      }
    } catch (err) {
      console.error("Error submitting leave request:", err);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 space-y-10">
      <div className="w-24 rounded-full overflow-hidden">
        <img src={user?.image} alt="User" />
      </div>

      <h2 className="text-2xl font-bold text-gray-800">
        Welcome, {user?.username} (Student)
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

      <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab("gate")}
          className={`py-2 px-4 rounded-lg font-semibold ${
            activeTab === "gate"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Gate Pass
        </button>
        {userStatus !== "home" && (
          <button
            onClick={() => setActiveTab("leave")}
            className={`py-2 px-4 rounded-lg font-semibold ${
              activeTab === "leave"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Leave Request
          </button>
        )}
      </div>

      {activeTab === "gate" && (
        <form
          onSubmit={handleRequestSubmit}
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
        >
          <h3 className="text-xl font-semibold mb-4">Gate Pass Request</h3>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Purpose:
            </label>
            <input
              type="text"
              name="purpose"
              value={request.purpose}
              onChange={handleRequestChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
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
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Submit Request
          </button>
        </form>
      )}

      {activeTab === "leave" && (
        <form
          onSubmit={handleLeaveSubmit}
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
        >
          <h3 className="text-xl font-semibold mb-4 text-red-600">
            Leave Request (Warden)
          </h3>

          {userStatus === "home" && (
            <p className="text-yellow-600 font-medium mb-4">
              You are currently at <strong>home</strong> and cannot request
              hostel leave.
            </p>
          )}

          <div className="mb-3">
            <label className="block text-gray-700 mb-1">Reason:</label>
            <input
              type="text"
              name="purpose"
              value={leave.purpose}
              onChange={handleLeaveChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
              disabled={userStatus === "home"}
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 mb-1">Leave Date:</label>
            <input
              type="date"
              name="leaveDate"
              value={leave.leaveDate}
              onChange={handleLeaveChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
              disabled={userStatus === "home"}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Return Date:</label>
            <input
              type="date"
              name="returnDate"
              value={leave.returnDate}
              onChange={handleLeaveChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
              disabled={userStatus === "home"}
            />
          </div>
          <button
            type="submit"
            disabled={userStatus === "home"}
            className={`w-full ${
              userStatus === "home"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-700"
            } text-white font-bold py-2 px-4 rounded-lg`}
          >
            Submit Leave Request
          </button>
        </form>
      )}
    </div>
  );
};

export default Student;
