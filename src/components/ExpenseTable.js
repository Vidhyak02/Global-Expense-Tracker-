function ExpenseTable({ expenses, onDelete, currency = "USD" }) {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-400">
        No expenses added yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Category</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Description</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Amount</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Date</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{expense.category}</td>
                <td className="px-6 py-4 text-sm font-medium">{expense.name}</td>
                <td className="px-6 py-4 text-sm font-semibold">
                  {currency === "USD" ? `$${expense.amount}` : `₹${expense.amount}`}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{expense.date}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenseTable;