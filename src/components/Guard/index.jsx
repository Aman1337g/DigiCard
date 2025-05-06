import React, { useEffect, useState } from "react";

const Guard = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

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
    fetchRequests();
  }, []);

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

  const handleAction = async (username, action) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/requests/${username}/${action}`,
        {
          method: "PATCH",
        }
      );

      if (res.ok) {
        alert(`Request ${action}ed!`);
        fetchRequests(); // refresh list
      } else {
        alert("Failed to process the request.");
      }
    } catch (err) {
      console.error("Error handling request:", err);
    }
  };

  const filteredRequests =
    filter === "all" ? requests : requests.filter((r) => r.role === filter);
  console.log(filteredRequests)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Guard Panel</h2>
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
              className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 flex flex-col items-center"
            >
              <img
                src={req.image || "https://via.placeholder.com/150"}
                alt="User"
                className="w-24 h-24 rounded-full object-cover border mb-4"
              />
              <p className="text-gray-800 font-medium text-center">
                <span className="font-bold">{req.username}</span>, who is a{" "}
                <span className="text-blue-600 font-bold">{req.role}</span>, has
                requested to{" "}
                <span className="font-bold text-green-600">
                  {req.type === "in" ? "come in" : "go out"}
                </span>{" "}
                for {req.purpose}.
              </p>
              <div className="mt-3 flex justify-center space-x-3">
                <button
                  onClick={() => handleAction(req.username, "approve")}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(req.username, "reject")}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 py-4">
            No requests at the moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default Guard;
