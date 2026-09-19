import { useState, useEffect } from "react";
import SummaryCard from "../components/SummaryCard";

function Home() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const email = currentUser?.email;

  const [usaExpenses, setUsaExpenses] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [indiaExpenses, setIndiaExpenses] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(null);

  // Salary states
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [salaryInput, setSalaryInput] = useState("");
  const [isEditingSalary, setIsEditingSalary] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const usa = JSON.parse(localStorage.getItem(`expenses_${email}`)) || [];
    const transferData = JSON.parse(localStorage.getItem(`transfers_${email}`)) || [];
    const india = JSON.parse(localStorage.getItem(`indiaExpenses_${email}`)) || [];
    const savedSalary = JSON.parse(localStorage.getItem(`salary_${email}`)) || 0;

    setUsaExpenses(usa);
    setTransfers(transferData);
    setIndiaExpenses(india);
    setMonthlySalary(savedSalary);

    if (savedSalary === 0) {
      setIsEditingSalary(true); // Show input if no salary set yet
    }
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
        console.log("Failed to fetch exchange rate");
      }
    };
    fetchRate();
  }, []);

  // Save salary
  const handleSaveSalary = () => {
    const amount = Number(salaryInput);
    if (!amount || amount <= 0) return;

    setMonthlySalary(amount);
    localStorage.setItem(`salary_${email}`, JSON.stringify(amount));
    setIsEditingSalary(false);
    setSalaryInput("");
  };

  // Calculations
  const totalUSA = usaExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalSent = transfers.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalIndia = indiaExpenses.reduce((sum, item) => sum + Number(item.amount), 0);

  const salaryInINR = exchangeRate ? (monthlySalary * exchangeRate).toFixed(0) : "—";
  const usaInINR = exchangeRate ? (totalUSA * exchangeRate).toFixed(0) : "—";
  const sentInINR = exchangeRate
    ? transfers.reduce((sum, t) => sum + Number(t.inrReceived || 0), 0).toFixed(0)
    : "—";

  const indiaBalance =
    sentInINR !== "—" ? (sentInINR - totalIndia).toFixed(0) : "—";

  // Greeting
  const hour = new Date().getHours();
  let greeting = "Hello";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  // Recent transactions
  const recentUSA = [...usaExpenses].reverse().slice(0, 3);
  const recentIndia = [...indiaExpenses].reverse().slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {greeting}, {currentUser?.name} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            {new Date().toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}{" "}
            Financial Overview
          </p>
        </div>

        {/* Salary Input Section */}
        {isEditingSalary ? (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border-l-4 border-blue-500">
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              Enter Your Monthly Salary (USD)
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="number"
                value={salaryInput}
                onChange={(e) => setSalaryInput(e.target.value)}
                placeholder="Example: 3500"
                min="1"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={handleSaveSalary}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Save Salary
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              This will be used for all calculations on this page.
            </p>
          </div>
        ) : (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setSalaryInput(monthlySalary || "");
                setIsEditingSalary(true);
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Edit Salary
            </button>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <SummaryCard
            title="Monthly Salary"
            amount={`$${monthlySalary.toLocaleString()}`}
            subAmount={
              exchangeRate && monthlySalary > 0
                ? `₹${Number(salaryInINR).toLocaleString()}`
                : ""
            }
            color="border-blue-500"
          />
          <SummaryCard
            title="USA Expenses"
            amount={`$${totalUSA.toLocaleString()}`}
            subAmount={
              exchangeRate ? `₹${Number(usaInINR).toLocaleString()}` : ""
            }
            color="border-red-500"
          />
          <SummaryCard
            title="Money Sent to India"
            amount={`$${totalSent.toLocaleString()}`}
            subAmount={
              exchangeRate ? `₹${Number(sentInINR).toLocaleString()}` : ""
            }
            color="border-green-500"
          />
          <SummaryCard
            title="India Expenses"
            amount={`₹${totalIndia.toLocaleString()}`}
            color="border-purple-500"
          />
        </div>

        {/* Money Flow */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Money Flow</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                ${monthlySalary.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Salary</p>
            </div>
            <div className="text-gray-400 text-2xl">↓</div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                ${totalUSA.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">USA Expenses</p>
            </div>
            <div className="text-gray-400 text-2xl">↓</div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                ${totalSent.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Sent to India</p>
            </div>
            <div className="text-gray-400 text-2xl">↓</div>
            <div>
              <p className="text-2xl font-bold text-indigo-600">
                ₹
                {sentInINR !== "—"
                  ? Number(sentInINR).toLocaleString()
                  : "—"}
              </p>
              <p className="text-sm text-gray-500">Received in India</p>
            </div>
            <div className="text-gray-400 text-2xl">↓</div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                ₹{totalIndia.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">India Expenses</p>
            </div>
            <div className="text-gray-400 text-2xl">↓</div>
            <div>
              <p className="text-2xl font-bold text-teal-600">
                ₹
                {indiaBalance !== "—"
                  ? Number(indiaBalance).toLocaleString()
                  : "—"}
              </p>
              <p className="text-sm text-gray-500">India Balance</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent USA */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Recent USA Expenses
            </h3>
            {recentUSA.length === 0 ? (
              <p className="text-gray-400 text-sm">No expenses yet</p>
            ) : (
              <div className="space-y-3">
                {recentUSA.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.category} • {item.date}
                      </p>
                    </div>
                    <p className="font-semibold text-red-600">${item.amount}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent India */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Recent India Expenses
            </h3>
            {recentIndia.length === 0 ? (
              <p className="text-gray-400 text-sm">No expenses yet</p>
            ) : (
              <div className="space-y-3">
                {recentIndia.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.category} • {item.date}
                      </p>
                    </div>
                    <p className="font-semibold text-purple-600">
                      ₹{item.amount}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;