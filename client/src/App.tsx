import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Teacher from "./pages/Teacher";
import Student from "./pages/Student";
import useUser from "./hooks/useUser";

const Protected = ({ role, children }: { role?: string; children: JSX.Element }) => {
  const { user, loading } = useUser();

  if (loading) return <div>Betöltés...</div>;
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/admin" element={<Protected role="admin"><Admin /></Protected>} />
        <Route path="/teacher" element={<Protected role="teacher"><Teacher /></Protected>} />
        <Route path="/student" element={<Protected role="student"><Student /></Protected>} />
      </Routes>
    </BrowserRouter>
  );
}
