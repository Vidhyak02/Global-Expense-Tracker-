import { useState, useEffect } from "react";

function Comparison() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const email = currentUser?.email;

  const [usaExpenses, setUsaExpenses] = useState([]);
  const [indiaExpenses, setIndiaExpenses] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loadingRate, setLoadingRate] = useState(true);

  // AI states
  const [aiInsights, setAiInsights] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Load data
  useEffect(() => {
    const usa = JSON.parse(localStorage.getItem(`expenses_${email}`)) || [];
    const india = JSON.parse(localStorage.getItem(`indiaExpenses_${email}`)) || [];
    setUsaExpenses(usa);
    setIndiaExpenses(india);
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
        setLoadingRate(false);
      } catch (err) {
        setLoadingRate(false);
      }
    };
    fetchRate();
  }, []);

  // Calculate totals by category
  const getCategoryTotal = (expenses, category) => {
    return expenses
      .filter((item) => item.category === category)
      .reduce((sum, item) => sum + Number(item.amount), 0);
  };

  const categories = [
    "Housing",
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Education",
    "Other",
  ];

  // Prepare comparison data
  const comparisonData = categories
    .map((cat) => {
      const usaAmount = getCategoryTotal(usaExpenses, cat);
      const indiaAmount = getCategoryTotal(indiaExpenses, cat);
      const usaInINR = exchangeRate ? usaAmount * exchangeRate : 0;

      return {
        category: cat,
        usaUSD: usaAmount,
        usaINR: usaInINR,
        indiaINR: indiaAmount,
      };
    })
    .filter((item) => item.usaUSD > 0 || item.indiaINR > 0);

  // Find max for bar width
  const maxAmount = Math.max(
    ...comparisonData.map((item) => Math.max(item.usaINR, item.indiaINR)),
    1
  );

  // Generate AI Insights (with Fallback)
    // Generate AI Insights
  const generateInsights = async () => {
    setLoadingAI(true);
    setAiError(null);
    setAiInsights("");

    // Create summary text
    let summary = "USA Expenses (converted to INR):\n";
    comparisonData.forEach((item) => {
      if (item.usaINR > 0) {
        summary += `${item.category}: Rs ${Math.round(item.usaINR).toLocaleString()}\n`;
      }
    });

    summary += "\nIndia Expenses:\n";
    comparisonData.forEach((item) => {
      if (item.indiaINR > 0) {
        summary += `${item.category}: Rs ${item.indiaINR.toLocaleString()}\n`;
      }
    });

    try {
      const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text:
                      summary +
                      "\n\nGive exactly 6 short practical financial observations comparing USA and India spending. Number them 1 to 6. Use only plain text. No special characters.",
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error("API failed");
      }

      const text = data.candidates[0].content.parts[0].text;
      setAiInsights(text);
    } catch (err) {
      // ===== FALLBACK - Always shows 6 clear points =====
      const fallback = [];

      const sortedUSA = [...comparisonData]
        .filter((i) => i.usaINR > 0)
        .sort((a, b) => b.usaINR - a.usaINR);

      const sortedIndia = [...comparisonData]
        .filter((i) => i.indiaINR > 0)
        .sort((a, b) => b.indiaINR - a.indiaINR);

      const totalUSA = comparisonData.reduce((sum, i) => sum + i.usaINR, 0);
      const totalIndia = comparisonData.reduce((sum, i) => sum + i.indiaINR, 0);

      // Point 1
      if (sortedUSA.length > 0) {
        fallback.push(
          `1. Highest USA expense is ${sortedUSA[0].category} (Rs ${Math.round(
            sortedUSA[0].usaINR
          ).toLocaleString()}).`
        );
      } else {
        fallback.push("1. No USA expenses added yet. Start tracking your USA spending.");
      }

      // Point 2
      if (sortedIndia.length > 0) {
        fallback.push(
          `2. Highest India expense is ${sortedIndia[0].category} (Rs ${sortedIndia[0].indiaINR.toLocaleString()}).`
        );
      } else {
        fallback.push("2. No India expenses added yet. Start tracking your India spending.");
      }

      // Point 3
      if (totalUSA > 0 && totalIndia > 0) {
        if (totalUSA > totalIndia * 1.3) {
          fallback.push(
            "3. Your USA spending (in INR) is significantly higher than India spending."
          );
        } else if (totalIndia > totalUSA * 1.3) {
          fallback.push(
            "3. Your India spending is higher than USA spending when converted to INR."
          );
        } else {
          fallback.push(
            "3. Your USA and India spending levels are relatively balanced."
          );
        }
      } else {
        fallback.push(
          "3. Add expenses in both USA and India to get a proper comparison."
        );
      }

      // Point 4
      fallback.push(
        "4. Review discretionary categories like Shopping and Entertainment regularly."
      );

      // Point 5
      fallback.push(
        "5. Set a monthly budget for both countries and track progress every week."
      );

      // Point 6
      fallback.push(
        "6. Use the Money Transfer page to record all money sent to India for better tracking."
      );

      setAiInsights(fallback.join("\n\n"));
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          USA vs India Comparison
        </h1>
        <p className="text-gray-500 mb-8">
          Compare your spending after converting USA expenses to INR
        </p>

        {/* Exchange Rate */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-8">
          {loadingRate ? (
            <p className="text-blue-600">Loading exchange rate...</p>
          ) : exchangeRate ? (
            <p>
              Current Rate:{" "}
              <span className="font-bold text-green-600">
                1 USD = ₹{exchangeRate}
              </span>
            </p>
          ) : (
            <p className="text-red-600">Failed to load exchange rate</p>
          )}
        </div>

        {/* Comparison Table */}
        {comparisonData.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-400 mb-8">
            No expenses to compare yet. Add some USA and India expenses first.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                    Category
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                    USA (INR)
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                    India (INR)
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item) => (
                  <tr key={item.category} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{item.category}</td>
                    <td className="px-6 py-4 text-red-600 font-semibold">
                      ₹{Math.round(item.usaINR).toLocaleString()}
                      <span className="text-xs text-gray-400 ml-1">
                        (${item.usaUSD})
                      </span>
                    </td>
                    <td className="px-6 py-4 text-purple-600 font-semibold">
                      ₹{item.indiaINR.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Visual Bars */}
        {comparisonData.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Visual Comparison
            </h2>

            <div className="space-y-6">
              {comparisonData.map((item) => (
                <div key={item.category}>
                  <p className="font-medium text-gray-700 mb-2">
                    {item.category}
                  </p>

                  {/* USA Bar */}
                  <div className="mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm w-12 text-gray-500">USA</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-red-500 h-6 rounded-full flex items-center justify-end pr-2"
                          style={{
                            width: `${(item.usaINR / maxAmount) * 100}%`,
                            minWidth: item.usaINR > 0 ? "40px" : "0",
                          }}
                        >
                          {item.usaINR > 0 && (
                            <span className="text-xs text-white font-medium">
                              ₹{Math.round(item.usaINR).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* India Bar */}
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm w-12 text-gray-500">India</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-purple-500 h-6 rounded-full flex items-center justify-end pr-2"
                          style={{
                            width: `${(item.indiaINR / maxAmount) * 100}%`,
                            minWidth: item.indiaINR > 0 ? "40px" : "0",
                          }}
                        >
                          {item.indiaINR > 0 && (
                            <span className="text-xs text-white font-medium">
                              ₹{item.indiaINR.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gemini AI Insights */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-gray-800">
              🤖 AI Financial Insights
            </h2>
            <button
              onClick={generateInsights}
              disabled={loadingAI}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-400 transition"
            >
              {loadingAI ? "Generating..." : "Generate Insights"}
            </button>
          </div>

          {loadingAI && (
            <p className="text-blue-600">Loading AI insights...</p>
          )}

          {aiError && (
            <p className="text-red-600">{aiError}</p>
          )}

          {aiInsights && (
            <div className="bg-indigo-50 rounded-lg p-5 whitespace-pre-line text-gray-700">
              {aiInsights}
            </div>
          )}

          {!aiInsights && !loadingAI && !aiError && (
            <p className="text-gray-400 text-sm">
              Click the button to get AI-powered observations based on your actual spending data.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Comparison;