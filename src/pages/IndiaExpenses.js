import { useState, useEffect } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseTable from "../components/ExpenseTable";

function IndiaExpenses() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const email = currentUser?.email;

  const [expenses, setExpenses] = useState([]);

  // Load expenses from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`indiaExpenses_${email}`)) || [];
    setExpenses(saved);
  }, [email]);

  // Add expense
  const handleAddExpense = (newExpense) => {
    const updated = [...expenses, newExpense];
    setExpenses(updated);
    localStorage.setItem(`indiaExpenses_${email}`, JSON.stringify(updated));
  };

  // Delete expense
  const handleDelete = (id) => {
    const updated = expenses.filter((item) => item.id !== id);
    setExpenses(updated);
    localStorage.setItem(`indiaExpenses_${email}`, JSON.stringify(updated));
  };

  // Total
  const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          India Expenses 🇮🇳
        </h1>
        <p className="text-gray-500 mb-8">
          Track your expenses in India
        </p>

        {/* Form */}
        <ExpenseForm onAddExpense={handleAddExpense} currency="INR" />

        {/* Total */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-6">
          <p className="text-sm text-gray-500">Total India Expenses</p>
          <p className="text-2xl font-bold text-purple-600">
            ₹{total.toLocaleString()}
          </p>
        </div>

        {/* Table */}
        <ExpenseTable
          expenses={expenses}
          onDelete={handleDelete}
          currency="INR"
        />
      </div>
    </div>
  );
}

export default IndiaExpenses;