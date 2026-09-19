import { useState, useEffect } from "react";

function MoneyTransfer() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const email = currentUser?.email;

  const [amount, setAmount] = useState("");
  const [fee, setFee] = useState("");
  const [date, setDate] = useState("");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transfers, setTransfers] = useState([]);

  // Load previous transfers
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`transfers_${email}`)) || [];
    setTransfers(saved);
  }, [email]);

  // Fetch live exchange rate
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const API_KEY = process.env.REACT_APP_EXCHANGE_API_KEY;
        const res = await fetch(
          `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`
        );

        if (!res.ok) throw new Error("Failed to fetch exchange rate");

        const data = await res.json();
        setExchangeRate(data.conversion_rates.INR);
        setLoading(false);
      } catch (err) {
        setError("Unable to fetch exchange rate. Please try again later.");
        setLoading(false);
      }
    };

    fetchRate();
  }, []);

  // Calculate values
  const amountNum = Number(amount) || 0;
  const feeNum = Number(fee) || 0;
  const amountAfterFee = amountNum - feeNum;
  const inrReceived = exchangeRate ? (amountAfterFee * exchangeRate).toFixed(0) : 0;

  // Add transfer
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || !fee || !date || !exchangeRate) return;

    const newTransfer = {
      id: Date.now(),
      amount: amountNum,
      fee: feeNum,
      inrReceived: Number(inrReceived),
      exchangeRate: exchangeRate,
      date,
    };

    const updated = [...transfers, newTransfer];
    setTransfers(updated);
    localStorage.setItem(`transfers_${email}`, JSON.stringify(updated));

    // Reset form
    setAmount("");
    setFee("");
    setDate("");
  };

  // Delete transfer
  const handleDelete = (id) => {
    const updated = transfers.filter((item) => item.id !== id);
    setTransfers(updated);
    localStorage.setItem(`transfers_${email}`, JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Money Transfer 🇺🇸 → 🇮🇳
        </h1>
        <p className="text-gray-500 mb-8">
          Record money sent from USA to India
        </p>

        {/* Exchange Rate Status */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-6">
          {loading && <p className="text-blue-600">Loading exchange rate...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {exchangeRate && (
            <p className="text-lg">
              Current Exchange Rate:{" "}
              <span className="font-bold text-green-600">
                1 USD = ₹{exchangeRate}
              </span>
            </p>
          )}
        </div>

        {/* Transfer Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            New Transfer
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (USD)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1500"
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transfer Fee (USD)
              </label>
              <input
                type="number"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder="15"
                required
                min="0"
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

          {/* Live Calculation */}
          {amountNum > 0 && exchangeRate && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500">Amount Sent</p>
                <p className="font-bold text-lg">${amountNum}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Transfer Fee</p>
                <p className="font-bold text-lg text-red-600">${feeNum}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount Converted</p>
                <p className="font-bold text-lg">${amountAfterFee}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">India Receives</p>
                <p className="font-bold text-lg text-green-600">
                  ₹{Number(inrReceived).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!exchangeRate}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            Record Transfer
          </button>
        </form>

        {/* Transfer History */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Transfer History</h2>
          </div>

          {transfers.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No transfers recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600">USD Sent</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600">Fee</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600">INR Received</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[...transfers].reverse().map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{item.date}</td>
                      <td className="px-6 py-4 text-sm font-medium">${item.amount}</td>
                      <td className="px-6 py-4 text-sm text-red-600">${item.fee}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        ₹{item.inrReceived.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(item.id)}
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
          )}
        </div>
      </div>
    </div>
  );
}

export default MoneyTransfer;