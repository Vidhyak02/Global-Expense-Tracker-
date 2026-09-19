function SummaryCard({ title, amount, subAmount, color }) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-5 border-l-4 ${color}`}>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{amount}</p>
      {subAmount && (
        <p className="text-sm text-gray-500 mt-1">{subAmount}</p>
      )}
    </div>
  );
}

export default SummaryCard;