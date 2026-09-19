import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfileMenu({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Remove only the current session
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="relative">
      {/* User name button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white hover:text-blue-100 font-medium"
      >
        <span>{user.name}</span>
        <span className="text-sm">▼</span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
          <div className="px-4 py-2 border-b">
            <p className="font-semibold text-gray-800">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;