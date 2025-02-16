import React, { useState, useEffect } from "react";

const Guard = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setRequests(JSON.parse(localStorage.getItem("requests")) || []);
  }, []);

  const handleApprove = (username) => {
    const updatedRequests = requests.filter((req) => req.username !== username);
    setRequests(updatedRequests);
    localStorage.setItem("requests", JSON.stringify(updatedRequests));

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex((u) => u.username === username);
    if (userIndex !== -1) {
      users[userIndex].status = users[userIndex].status === "in" ? "out" : "in";
      localStorage.setItem("users", JSON.stringify(users));
    }

    alert("Request approved!");
  };

  const handleReject = (username) => {
    const updatedRequests = requests.filter((req) => req.username !== username);
    setRequests(updatedRequests);
    localStorage.setItem("requests", JSON.stringify(updatedRequests));

    alert("Request rejected!");
  };

  const filteredRequests =
    filter === "all" ? requests : requests.filter((r) => r.role === filter);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Guard Panel</h2>
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
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 flex flex-col items-start"
            >
              <p className="text-gray-800 font-medium">
                <span className="font-bold">{req.username}</span>, who is a{" "}
                <span className="text-blue-600 font-bold">{req.role}</span>, has
                requested to{" "}
                <span className="font-bold text-green-600">
                  {req.requestType === "entry" ? "come in" : "go out"}
                </span>{" "}
                for {req.purpose}.
              </p>
              <div className="mt-3 flex justify-end w-full space-x-3">
                <button
                  onClick={() => handleApprove(req.username)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(req.username)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-all"
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
