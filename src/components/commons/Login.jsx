import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      login(user.username, user.role);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (username === "admin" && password === "admin") {
      login(username, "admin");
      return;
    }

    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      login(user.username, user.role);
    } else {
      alert("Invalid username or password!");
    }
  };

  return (
    <div className=" bg-gray-100">
    <div className="flex flex-col items-center w-full md:w-1/2 lg:w-1/3 mx-auto justify-center gap-12 h-screen p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full text-center">
        <h1 className="font-bold text-3xl text-gray-800 mb-6">Welcome to DigiCard!!!</h1>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <input
            className="border-2 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="border-2 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-lg transition duration-300"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Login;
