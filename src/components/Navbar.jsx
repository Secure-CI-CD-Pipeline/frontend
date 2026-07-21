import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
      <Link to="/" className="font-bold text-lg">EventHub</Link>
      <div className="flex gap-4 items-center text-sm">
        <Link to="/">Events</Link>
        {user && <Link to="/dashboard">My Events</Link>}
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && (
          <>
            <span className="opacity-70">{user.email}</span>
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
