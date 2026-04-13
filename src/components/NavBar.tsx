import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, logout, getCurrentUser } from "../api/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black to-transparent">
      <div className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-red-600">
            NETFLIX
          </Link>
          
          {authenticated && (
            <div className="hidden md:flex gap-6">
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                to="/upload"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Upload
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {authenticated ? (
            <>
              <span className="text-gray-400 text-sm hidden md:block">
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
