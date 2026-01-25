import React, { useState, useEffect } from "react";
import { AlertTriangle, Package, Calendar, User, DollarSign, RefreshCw } from "lucide-react";
import API from "../../Configs/ApiEndpoints";
import toast from "react-hot-toast";
import ConfirmationModal from "../../components/Common/ConfirmationModal";

const DeliveryReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    const fetchReports = async () => {
        try {
            const response = await fetch(API.GET_DELIVERY_REPORTS, {
                credentials: "include"
            });
            const data = await response.json();
            if (data.status === "success") {
                setReports(data.reports);
            } else {
                toast.error(data.message || "Failed to fetch reports");
            }
        } catch (error) {
            console.error("Error fetching reports:", error);
            toast.error("Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    const initiateResolve = (orderId, orderNo) => {
        setSelectedReport({ orderId, orderNo });
        setModalOpen(true);
    };

    const handleConfirmResolve = async () => {
        setModalOpen(false);
        if (!selectedReport) return;

        const { orderId } = selectedReport;
        const toastId = toast.loading("Resetting order status...");

        try {
            const formData = new FormData();
            formData.append("order_id", orderId);

            const response = await fetch(API.RESOLVE_DELIVERY_REPORT, {
                method: "POST",
                body: formData,
                credentials: "include"
            });
            const data = await response.json();

            if (data.status === "success") {
                toast.success(data.message, { id: toastId });
                fetchReports();
            } else {
                toast.error(data.message || "Failed to resolve report", { id: toastId });
            }
        } catch (error) {
            console.error("Error resolving report:", error);
            toast.error("Network error", { id: toastId });
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                        Delivery Discrepancies
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Orders reported as "Not Received" by customers
                    </p>
                </div>
                <button
                    onClick={fetchReports}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            {reports.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
                    <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-600">No reports found</h3>
                    <p className="text-slate-400">Great job! No delivery boy mistakes or customer disputes recorded yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Details</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reported Time</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-800">{report.order_no}</span>
                                                <span className="text-xs text-slate-500">{report.product}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
                                                    {report.customer.charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium text-slate-700">{report.customer}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-slate-700">{report.amount}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {report.time}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-50 text-red-600 border border-red-100">
                                                {report.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => initiateResolve(report.order_id, report.order_no)}
                                                className="px-3 py-1.5 bg-slate-800 text-white text-[10px] font-black uppercase rounded-lg hover:bg-slate-900 transition-all flex items-center gap-2 ml-auto">
                                                <RefreshCw className="w-3 h-3" /> Reset to Pending
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                    <p className="text-sm font-bold text-red-800 lowercase first-letter:uppercase">Important notice</p>
                    <p className="text-xs text-red-700 mt-0.5">Please review these reports carefully. Frequent discrepancies may result in account review. Contact support if you believe a report is incorrect.</p>
                </div>
            </div>

            <ConfirmationModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleConfirmResolve}
                title="Reset Order Status"
                message={`Are you sure you want to reset ${selectedReport?.orderNo} back to 'Pending Confirmation'? This will delete the report and allow you to resend the confirmation link.`}
                confirmText="Reset Status"
            />
        </div>
    );
};

export default DeliveryReports;
