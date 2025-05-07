import React, { useEffect, useState } from "react";

const Warden = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOOHostelRequests = async () => {
    try {
      const res = await fetch("https://digicard-backend-fgfe.onrender.com/api/warden/requests/pending");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch hostel leave requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`https://digicard-backend-fgfe.onrender.com/api/warden/requests/${id}/${action}`, {
        method: "PATCH",
      });
      if (res.ok) {
        alert(`Request ${action}d!`);
        fetchOOHostelRequests();
      } else {
        const data = await res.json();
        alert(`Failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error handling request:", err);
    }
  };

  useEffect(() => {
    fetchOOHostelRequests(); // Initial fetch
  
    const intervalId = setInterval(() => {
      fetchOOHostelRequests();
    }, 60000); // 60,000 ms = 1 minute
  
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Warden Panel</h2>

      <div className="w-full max-w-xl space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : requests.length > 0 ? (
          requests.map((req) => (
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
                <span className="font-bold">{req.username}</span> ({req.role}) has
                requested hostel leave for{" "}
                <span className="text-green-600 font-bold">{req.purpose}</span>.
              </p>
              <div className="mt-3 flex justify-center space-x-3">
                <button
                  onClick={() => handleAction(req.id, "approve")}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(req.id, "reject")}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 py-4">No hostel leave requests at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Warden;
