import { Link, useLocation } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";

function Navbar() {
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const navLinks = [
    { path: "/home", label: "Home" },
    { path: "/usa-expenses", label: "USA Expenses" },
    { path: "/money-transfer", label: "Money Transfer" },
    { path: "/india-expenses", label: "India Expenses" },
    { path: "/comparison", label: "Comparison" },
  ];

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div className="flex items-center gap-2 font-bold text-lg">
            🌍 Global Expense Tracker
          </div>

          {/* Center - Navigation Links */}
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

          {/* Right side - Profile */}
          <div>
            {currentUser && <ProfileMenu user={currentUser} />}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;