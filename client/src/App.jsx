import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SchoolRegister from "./pages/SchoolRegister";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

const Protected = ({ role, children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/dashboard" />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SchoolRegister />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <Protected>
            <Dashboard />
          </Protected>
        } />
        <Route path="/admin" element={
          <Protected role="admin">
            <Admin />
          </Protected>
        } />
      </Routes>
    </BrowserRouter>
  );
}
