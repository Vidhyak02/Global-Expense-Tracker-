import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/home", label: "Home" },
    { path: "/usa-expenses", label: "USA Expenses" },
    { path: "/money-transfer", label: "Money Transfer" },
    { path: "/india-expenses", label: "India Expenses" },
    { path: "/comparison", label: "Comparison" },
  ];

  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-lg">
            <span className="text-xl">🌍</span>
            <span className="hidden sm:inline">Global Expense Tracker</span>
            <span className="sm:hidden">Expense Tracker</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`hover:text-blue-200 transition ${
                  location.pathname === link.path
                    ? "text-yellow-300 font-semibold"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="hidden md:block">
                <ProfileMenu user={currentUser} />
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white focus:outline-none text-2xl"
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-800 border-t border-blue-600">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  location.pathname === link.path
                    ? "bg-blue-600 text-yellow-300"
                    : "text-white hover:bg-blue-700"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {currentUser && (
              <div className="border-t border-blue-600 mt-3 pt-3">
                <div className="px-4 py-2">
                  <p className="font-semibold text-white">{currentUser.name}</p>
                  <p className="text-sm text-blue-200">{currentUser.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2.5 text-red-300 hover:bg-blue-700 rounded-lg text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
