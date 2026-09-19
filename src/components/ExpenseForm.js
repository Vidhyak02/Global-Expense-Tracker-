import { useState } from "react";

function ExpenseForm({ onAddExpense, currency = "USD" }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Housing");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const categories =
    currency === "USD"
      ? ["Housing", "Food", "Transport", "Shopping", "Bills", "Entertainment", "Other"]
      : ["Housing", "Food", "Shopping", "Education", "Transport", "Bills", "Entertainment", "Other"];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !amount || !date) return;

    const newExpense = {
      id: Date.now(),
      name,
      category,
      amount: Number(amount),
      date,
    };

    onAddExpense(newExpense);

    // Reset form
    setName("");
    setCategory("Housing");
    setAmount("");
    setDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-5">Add New Expense</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expense Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Apartment Rent"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount ({currency === "USD" ? "$" : "₹"})
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-5 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        Add Expense
      </button>
    </form>
  );
}

export default ExpenseForm;