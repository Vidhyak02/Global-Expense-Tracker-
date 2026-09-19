import { useState, useEffect } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseTable from "../components/ExpenseTable";

function USAExpenses() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const email = currentUser?.email;

  const [expenses, setExpenses] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(null);

  // Load expenses from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`expenses_${email}`)) || [];
    setExpenses(saved);
  }, [email]);

  // Fetch exchange rate
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const API_KEY = process.env.REACT_APP_EXCHANGE_API_KEY;
        const res = await fetch(
          `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`
        );
        const data = await res.json();
        setExchangeRate(data.conversion_rates.INR);
      } catch (err) {
        console.log("Failed to fetch rate");
      }
    };
    fetchRate();
  }, []);

  // Add expense
  const handleAddExpense = (newExpense) => {
    const updated = [...expenses, newExpense];
    setExpenses(updated);
    localStorage.setItem(`expenses_${email}`, JSON.stringify(updated));
  };

  // Delete expense
  const handleDelete = (id) => {
    const updated = expenses.filter((item) => item.id !== id);
    setExpenses(updated);
    localStorage.setItem(`expenses_${email}`, JSON.stringify(updated));
  };

  // Total
  const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalInINR = exchangeRate ? (total * exchangeRate).toFixed(0) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">USA Expenses 🇺🇸</h1>
        <p className="text-gray-500 mb-8">Track your expenses in the United States</p>

        {/* Form */}
        <ExpenseForm onAddExpense={handleAddExpense} currency="USD" />

        {/* Total */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Total USA Expenses</p>
            <p className="text-2xl font-bold text-red-600">${total.toLocaleString()}</p>
          </div>
          {totalInINR && (
            <div className="text-right">
              <p className="text-sm text-gray-500">INR Equivalent</p>
              <p className="text-xl font-semibold text-gray-700">
                ₹{Number(totalInINR).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Table */}
        <ExpenseTable
          expenses={expenses}
          onDelete={handleDelete}
          currency="USD"
        />
      </div>
    </div>
  );
}

export default USAExpenses;