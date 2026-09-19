import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import USAExpenses from "./pages/USAExpenses";
import MoneyTransfer from "./pages/MoneyTransfer";
import IndiaExpenses from "./pages/IndiaExpenses";
import Comparison from "./pages/Comparison";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import AIChatBox from "./components/AIChatBox";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <div>
                <Navbar />
                <Home />
                <AIChatBox />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/usa-expenses"
          element={
            <ProtectedRoute>
              <div>
                <Navbar />
                <USAExpenses />
                <AIChatBox />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/money-transfer"
          element={
            <ProtectedRoute>
              <div>
                <Navbar />
                <MoneyTransfer />
                <AIChatBox />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/india-expenses"
          element={
            <ProtectedRoute>
              <div>
                <Navbar />
                <IndiaExpenses />
                <AIChatBox />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/comparison"
          element={
            <ProtectedRoute>
              <div>
                <Navbar />
                <Comparison />
                <AIChatBox />
              </div>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;