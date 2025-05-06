import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import AuthHOC from "./utils/AuthHOC";
import Admin from "./components/Admin";
import Student from "./components/Student";
import Faculty from "./components/Faculty";
import Staff from "./components/Staff";
import Visitor from "./components/Visitor";
import Guard from "./components/Guard";
import Warden from "./components/Warden";
import { Login, Unauthorized, NotFound} from "./components/commons";

const App = () => {
    return (
        <Router>
            <UserProvider>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<AuthHOC Component={Admin} allowedRoles={["admin"]} />} />
                    <Route path="/student" element={<AuthHOC Component={Student} allowedRoles={["student"]} />} />
                    <Route path="/faculty" element={<AuthHOC Component={Faculty} allowedRoles={["faculty"]} />} />
                    <Route path="/staff" element={<AuthHOC Component={Staff} allowedRoles={["staff"]} />} />
                    <Route path="/visitor" element={<AuthHOC Component={Visitor} allowedRoles={["visitor"]} />} />
                    <Route path="/guard" element={<AuthHOC Component={Guard} allowedRoles={["guard"]} />} />
                    <Route path="/warden" element={<AuthHOC Component={Warden} allowedRoles={["warden"]} />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </UserProvider>
        </Router>
    );
};

export default App;
