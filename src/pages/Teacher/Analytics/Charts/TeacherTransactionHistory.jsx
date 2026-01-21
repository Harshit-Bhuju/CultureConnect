import React from "react";
import { Download } from "lucide-react";

const TeacherTransactionHistory = ({ selectedPeriod = "This month" }) => {
  // Mock data - would typically come from props or hook based on period
  const transactions = [
    {
      id: "TRX-9871",
      student: "Rahul Sharma",
      course: "Introduction to Classical Dance",
      date: "Oct 24, 2025",
      amount: "₹49.99",
      status: "Completed",
    },
    {
      id: "TRX-9872",
      student: "Priya Patel",
      course: "Advanced Violin Masterclass",
      date: "Oct 24, 2025",
      amount: "₹120.00",
      status: "Completed",
    },
    {
      id: "TRX-9873",
      student: "Amit Singh",
      course: "Introduction to Classical Dance",
      date: "Oct 23, 2025",
      amount: "₹49.99",
      status: "Pending",
    },
    {
      id: "TRX-9874",
      student: "Sneha Gupta",
      course: "Digital Art Fundamentals",
      date: "Oct 22, 2025",
      amount: "₹35.00",
      status: "Completed",
    },
    {
      id: "TRX-9875",
      student: "Vikram Malhotra",
      course: "Piano for Beginners",
      date: "Oct 21, 2025",
      amount: "₹55.00",
      status: "Refunded",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Transaction History
        </h2>
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">To Course</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((trx) => (
              <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-blue-600">
                  {trx.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {trx.student}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {trx.course}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{trx.date}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {trx.amount}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      trx.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : trx.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}>
                    {trx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-200 text-center">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All Transactions
        </button>
      </div>
    </div>
  );
};

export default TeacherTransactionHistory;
