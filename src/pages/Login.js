import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanName = name.trim();

    if (!emailRegex.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!passwordRegex.test(cleanPassword)) {
      setError(
        "Password must be at least 6 characters and contain at least one letter and one number."
      );
      return;
    }

    let users = [];
    try {
      users = JSON.parse(localStorage.getItem("users")) || [];
    } catch (err) {
      users = [];
    }

    if (isLogin) {
      const user = users.find((u) => u.email === cleanEmail);

      if (!user) {
        setError("Account not found. Please register first.");
        return;
      }

      if (user.password !== cleanPassword) {
        setError("Incorrect password. Please try again.");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate("/home");
    } else {
      if (!cleanName || cleanName.length < 2) {
        setError("Please enter a valid full name (minimum 2 characters).");
        return;
      }

      const existingUser = users.find((u) => u.email === cleanEmail);

      if (existingUser) {
        setError("This email is already registered. Please login.");
        return;
      }

      const newUser = {
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      setSuccess("Account created successfully! Please login.");
      setIsLogin(true);
      setName("");
      setPassword("");
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl">🌍</span>
            <h1 className="text-2xl font-bold text-gray-800">
              Global Expense Tracker
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            {isLogin
              ? "Login to manage your USA and India expenses"
              : "Create a new account to get started"}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError("");
              setSuccess("");
              setEmail("");
              setPassword("");
              setName("");
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              isLogin
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError("");
              setSuccess("");
              setEmail("");
              setPassword("");
              setName("");
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              !isLogin
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                autoComplete="off"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="off"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                isLogin
                  ? "Enter your password"
                  : "Min 6 characters, 1 letter and 1 number"
              }
              required
              autoComplete="new-password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg border border-green-100">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm"
          >
            {isLogin ? "LOGIN" : "CREATE ACCOUNT"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;