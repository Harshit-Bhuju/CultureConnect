import React, { useState, useEffect } from "react";
import {
  Search,
  CheckCircle,
  Calendar,
  MoreVertical,
  Eye,
  Mail,
  X,
  ShoppingBag,
  GraduationCap,
  Filter
} from "lucide-react";
import { toast } from "react-hot-toast";
import API, { BASE_URL } from "../../Configs/ApiEndpoints";
import Loading from "../../components/Common/Loading";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(API.GET_ADMIN_USERS, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setUsers(result.users);
      }
    } catch (err) {
      toast.error("Error loading users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (user) => {
    setSelectedUser(user);
    setLoadingDetails(true);
    setUserDetails(null);
    try {
      const response = await fetch(`${API.GET_ADMIN_USER_DETAILS}?user_id=${user.id}`, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setUserDetails(result.data);
      }
    } catch (err) {
      toast.error("Error loading user details");
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" ||
      (roleFilter === "seller_teacher" ? user.role === "Seller and Teacher" : user.role === roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1));

    return matchesSearch && matchesRole;
  });

  const handleSendEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          User Management
        </h2>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 bg-white"
            />
          </div>

          {/* Filter */}
          <div className="w-full md:w-64 relative">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={20}
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 bg-white appearance-none cursor-pointer text-gray-700 font-medium"
            >
              <option value="all">All Roles</option>
              <option value="user">User Only</option>
              <option value="seller">Seller Only</option>
              <option value="teacher">Teacher Only</option>
              <option value="seller_teacher">Seller & Teacher</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Role
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-gray-100 border border-gray-200">
                        {user.profile_pic ? (
                          <img
                            src={
                              user.profile_pic.startsWith("http") || user.profile_pic.startsWith("data:")
                                ? user.profile_pic
                                : `${BASE_URL}/uploads/${user.profile_pic}`
                            }
                            alt={user.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.parentNode.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold">${user.name.charAt(0)}</div>`;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold shadow-sm">
                            {user.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${user.role === "Teacher"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-gray-100 text-gray-700"
                        }`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {user.joinDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowMenu(showMenu === user.id ? null : user.id)
                        }
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical size={20} className="text-gray-600" />
                      </button>

                      {showMenu === user.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowMenu(null)}
                          />
                          <div className={`absolute right-0 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20 text-left ${index >= filteredUsers.length - 2 ? "bottom-full mb-2" : "mt-2"
                            }`}>
                            <button
                              onClick={() => {
                                setShowMenu(null);
                                fetchUserDetails(user);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors text-sm font-medium">
                              <Eye size={16} />
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                setShowMenu(null);
                                handleSendEmail(user.email);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors text-sm font-medium">
                              <Mail size={16} />
                              Send Email
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden bg-gray-100 border border-gray-200">
                  {selectedUser.profile_pic ? (
                    <img
                      src={
                        selectedUser.profile_pic.startsWith("http") || selectedUser.profile_pic.startsWith("data:")
                          ? selectedUser.profile_pic
                          : `${BASE_URL}/uploads/${selectedUser.profile_pic}`
                      }
                      alt={selectedUser.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentNode.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold text-xl">${selectedUser.name.charAt(0)}</div>`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-xl font-bold shadow-sm">
                      {selectedUser.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {loadingDetails ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                  <p className="text-gray-500 font-medium">Loading user details...</p>
                </div>
              ) : userDetails && (
                <>
                  {/* Purchases Section */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <ShoppingBag size={20} />
                      Purchase History
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Product Purchases */}
                      <div className="max-h-64 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider sticky top-0 bg-white z-10 py-1">Product Orders</p>
                        {userDetails.productOrders.length > 0 ? (
                          userDetails.productOrders.map((order, i) => (
                            <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                              <div className="flex justify-between items-start mb-2">
                                <p className="font-bold text-gray-900">{order.name}</p>
                                <span className="text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-700 uppercase">{order.order_status}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">{order.order_number}</span>
                                <span className="font-bold text-gray-900">Rs. {order.total_amount}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-400 italic">No product purchases yet.</p>
                        )}
                      </div>

                      {/* Course Purchases */}
                      <div className="max-h-64 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider sticky top-0 bg-white z-10 py-1">Course Enrollments</p>
                        {userDetails.courseOrders.length > 0 ? (
                          userDetails.courseOrders.map((order, i) => (
                            <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                              <div className="flex justify-between items-start mb-2">
                                <p className="font-bold text-gray-900">{order.name}</p>
                                <span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700 uppercase">{order.status || 'success'}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">{new Date(order.enrollment_date).toLocaleDateString()}</span>
                                <span className="font-bold text-gray-900">Rs. {order.amount}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-400 italic">No course enrollments yet.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Role Specific Content */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                    {/* Products (if seller) */}
                    {(selectedUser.role.toLowerCase().includes('seller')) && (
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <ShoppingBag size={20} className="text-blue-600" />
                          Seller Products
                        </h4>
                        {userDetails.products.length > 0 ? (
                          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                            {userDetails.products.map((p, i) => (
                              <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                <div>
                                  <p className="font-bold text-sm text-gray-900">{p.product_name}</p>
                                  <p className="text-xs text-gray-500">Stock: {p.stock} | Rs. {p.price}</p>
                                </div>
                                <button
                                  onClick={() => window.open(`/products/${selectedUser.id}/${p.id}`, '_blank')}
                                  className="text-xs font-bold text-blue-600 hover:text-blue-700 underline"
                                >
                                  View Product
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 italic">No products uploaded yet.</p>
                        )}
                      </div>
                    )}

                    {/* Courses (if teacher) */}
                    {(selectedUser.role.toLowerCase().includes('teacher')) && (
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <GraduationCap size={20} className="text-purple-600" />
                          Teacher Courses
                        </h4>
                        {userDetails.courses.length > 0 ? (
                          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                            {userDetails.courses.map((c, i) => (
                              <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                <div>
                                  <p className="font-bold text-sm text-gray-900">{c.course_title}</p>
                                  <p className="text-xs text-gray-500">Rs. {c.price} | {c.status}</p>
                                </div>
                                <button
                                  onClick={() => window.open(`/courses/${selectedUser.id}/${c.id}`, '_blank')}
                                  className="text-xs font-bold text-purple-600 hover:text-purple-700 underline"
                                >
                                  View Course
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 italic">No courses created yet.</p>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-md active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
