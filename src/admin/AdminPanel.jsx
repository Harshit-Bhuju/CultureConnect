import React, { useState, useEffect } from "react";
import {
  Upload,
  Trash2,
  Edit,
  Plus,
  Save,
  X,
  Users,
  Image,
  Layout,
  Home,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://192.168.1.10/CultureConnect/backend/admin_panel";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("admin");
  const [users, setUsers] = useState([]);
  const [sliders, setSliders] = useState([]);
  const [welcomeData, setWelcomeData] = useState({
    sections: [],
    carousels: [],
    parallax: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Admin Settings States
  const [adminData, setAdminData] = useState({
    username: "",
    email: "",
    profile_pic: "",
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [adminProfileFile, setAdminProfileFile] = useState(null);
  const [defaultImageFile, setDefaultImageFile] = useState(null);
    const { logout} = useAuth();
  

  // User Management States
  const [editingUser, setEditingUser] = useState(null);

  // Slider Management States
  const [editingSlider, setEditingSlider] = useState(null);
  const [addingSlider, setAddingSlider] = useState(false);
  const [sliderForm, setSliderForm] = useState({
    title: "",
    topic: "",
    description: "",
    position: 1,
    image: null,
  });

  // Welcome Section States
  const [editingSection, setEditingSection] = useState(null);
  const [editingCarousel, setEditingCarousel] = useState(null);
  const [editingParallax, setEditingParallax] = useState(null);

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "sliders") fetchSliders();
    if (activeTab === "welcome") fetchWelcome();
    if (activeTab === "admin") {
      fetchAdminData();
      fetchDefaultImage();
    }
  }, [activeTab]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  // ADMIN SETTINGS
  const fetchAdminData = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin_send.php`);
      const data = await res.json();
      if (data.status === "success") {
        setAdminData({
          ...adminData,
          username: data.data.username,
          email: data.data.email,
          profile_pic: data.data.profile_pic,
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
      } else {
        showMessage("error", data.message);
      }
    } catch (err) {
      showMessage("error", "Failed to fetch admin data");
    }
  };
  const [defaultProfilePic, setDefaultProfilePic] = useState("");

  const fetchDefaultImage = async () => {
    try {
      const res = await fetch(`${API_BASE}/default_image_send.php`);
      const data = await res.json();
      if (data.status === "success") {
        setDefaultProfilePic(data.default_image);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateAdminProfile = async () => {
    if (
      adminData.new_password &&
      adminData.new_password !== adminData.confirm_password
    ) {
      showMessage("error", "Passwords do not match");
      return;
    }

    if (adminData.new_password && !adminData.current_password) {
      showMessage("error", "Current password is required to change password");
      return;
    }

    const formData = new FormData();
    formData.append("update_admin", "1");
    formData.append("email", adminData.email);
    formData.append("username", adminData.username);
    formData.append("current_password", adminData.current_password);
    formData.append("new_password", adminData.new_password);
    if (adminProfileFile) formData.append("profile_pic", adminProfileFile);

    try {
      const res = await fetch(`${API_BASE}/admin_update.php`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status === "success") {
        showMessage("success", "Admin profile updated successfully");

        setAdminData({
          ...adminData,
          current_password: "",
          new_password: "",
          confirm_password: "",
          profile_pic: data.data.profile_pic || adminData.profile_pic,
          username: data.data.username || adminData.username,
        });

        setAdminProfileFile(null);
      } else {
        showMessage("error", data.message);
      }
    } catch (err) {
      showMessage("error", "Update failed");
    }
  };

  const updateDefaultImage = async () => {
    if (!defaultImageFile) {
      showMessage("error", "Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("default_profile", defaultImageFile);

    try {
      const res = await fetch(`${API_BASE}/default_img.php`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.status === "success") {
        showMessage("success", "Default image updated successfully");
        setDefaultImageFile(null);
      } else {
        showMessage("error", data.message);
      }
    } catch (err) {
      showMessage("error", "Update failed");
    }
  };

  // LOGOUT
   const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // USERS
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/delete_send.php`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Users fetch error:", err);
      showMessage("error", "Failed to fetch users");
      setUsers([]);
    }
    setLoading(false);
  };

  const deleteUser = async (email) => {
    if (!confirm("Delete this user?")) return;
    const formData = new URLSearchParams();
    formData.append("email", email);
    try {
      const res = await fetch(`${API_BASE}/delete_users.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      const data = await res.json();
      if (data.success) {
        showMessage("success", "User deleted");
        fetchUsers();
      } else {
        showMessage("error", data.message);
      }
    } catch (err) {
      showMessage("error", "Delete failed");
    }
  };

  // SLIDERS
  const fetchSliders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/sliders_send.php`);
      const data = await res.json();
      setSliders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Sliders fetch error:", err);
      showMessage("error", "Failed to fetch sliders");
      setSliders([]);
    }
    setLoading(false);
  };

  const addSlider = async () => {
    const formData = new FormData();
    formData.append("title", sliderForm.title);
    formData.append("topic", sliderForm.topic);
    formData.append("description", sliderForm.description);
    formData.append("position", sliderForm.position);
    formData.append("image", sliderForm.image);
    formData.append("add", "1");

    try {
      const res = await fetch(`${API_BASE}/sliders_add.php`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.status === "success") {
        showMessage("success", "Slider added");
        setAddingSlider(false);
        setSliderForm({
          title: "",
          topic: "",
          description: "",
          position: 1,
          image: null,
        });
        fetchSliders();
      } else {
        showMessage("error", data.message);
      }
    } catch (err) {
      showMessage("error", "Add failed");
    }
  };

  const updateSlider = async (slider) => {
    const formData = new FormData();
    formData.append("id", slider.id);
    formData.append("title", slider.title);
    formData.append("topic", slider.topic);
    formData.append("description", slider.description);
    formData.append("position", slider.position);
    if (slider.newImage) formData.append("image", slider.newImage);
    formData.append("update", "1");

    try {
      const res = await fetch(`${API_BASE}/sliders_update.php`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.status === "success") {
        showMessage("success", "Slider updated");
        setEditingSlider(null);
        fetchSliders();
      } else {
        showMessage("error", data.message);
      }
    } catch (err) {
      showMessage("error", "Update failed");
    }
  };

  const deleteSlider = async (id) => {
    if (!confirm("Delete this slider?")) return;
    const formData = new URLSearchParams();
    formData.append("id", id);
    formData.append("delete", "1");

    try {
      const res = await fetch(`${API_BASE}/sliders_delete.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      const data = await res.json();
      if (data.status === "success") {
        showMessage("success", "Slider deleted");
        fetchSliders();
      } else {
        showMessage("error", data.message);
      }
    } catch (err) {
      showMessage("error", "Delete failed");
    }
  };

  // WELCOME
  const fetchWelcome = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/welcome_send.php`);
      const data = await res.json();
      setWelcomeData({
        sections: data.sections || [],
        carousels: data.carousels || [],
        parallax: data.parallax || [],
      });
    } catch (err) {
      console.error("Welcome fetch error:", err);
      showMessage("error", "Failed to fetch welcome data");
      setWelcomeData({ sections: [], carousels: [], parallax: [] });
    }
    setLoading(false);
  };

  const updateSection = async (section) => {
    const formData = new URLSearchParams();
    formData.append("section_id", section.section_id);
    formData.append("title", section.title);
    formData.append("subtitle", section.subtitle);
    formData.append("description", section.description);
    formData.append("update", "1");

    try {
      const res = await fetch(`${API_BASE}/welcome_section_update.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      const data = await res.json();
      if (data.status === "success") {
        showMessage("success", "Section updated");
        setEditingSection(null);
        fetchWelcome();
      } else {
        showMessage("error", data.message);
      }
    } catch (err) {
      showMessage("error", "Update failed");
    }
  };

  const updateCarousel = async (carousel) => {
    const formData = new FormData();
    formData.append("image_id", carousel.image_id);
    formData.append("section_id", carousel.section_id);
    formData.append("position", carousel.position);
    formData.append("sort_order", carousel.sort_order || 1);
    if (carousel.newImage) formData.append("image", carousel.newImage);
    formData.append("update", "1");

    try {
      const res = await fetch(`${API_BASE}/welcome_carousel_update.php`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.status === "success") {
        showMessage("success", "Carousel updated");
        setEditingCarousel(null);
        fetchWelcome();
      } else {
        showMessage("error", data.message);
      }
    } catch (err) {
      showMessage("error", "Update failed");
    }
  };

  const updateParallax = async (parallax) => {
    const formData = new FormData();
    formData.append("id", parallax.parallax_id || parallax.id);
    formData.append("heading", parallax.heading);
    formData.append("subheading", parallax.subheading);
    formData.append("position", parallax.position);
    if (parallax.newImage) formData.append("image", parallax.newImage);
    formData.append("update", "1");

    try {
      const res = await fetch(`${API_BASE}/welcome_parallax_update.php`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.status === "success") {
        showMessage("success", "Parallax updated");
        setEditingParallax(null);
        fetchWelcome();
      } else {
        showMessage("error", data.message);
      }
    } catch (err) {
      showMessage("error", "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">CultureConnect Admin Panel</h1>
            <p className="text-indigo-100 mt-1">Manage your platform content</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm border border-white/20">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {message.text && (
        <div
          className={`mx-6 mt-4 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}>
          {message.text}
        </div>
      )}

      <div className="flex border-b bg-white shadow-sm overflow-x-auto">
        {[
          { id: "admin", label: "Admin Settings", icon: Settings },
          { id: "users", label: "Users", icon: Users },
          { id: "sliders", label: "Sliders", icon: Image },
          { id: "welcome", label: "Welcome", icon: Home },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:text-gray-900"
            }`}>
            <tab.icon size={20} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : (
          <>
            {activeTab === "admin" && (
              <div className="space-y-6">
                {/* Admin Profile Settings */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <User size={24} />
                    Admin Profile Settings
                  </h2>

                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0">
                      <img
                        src={
                          adminProfileFile
                            ? URL.createObjectURL(adminProfileFile)
                            : adminData.profile_pic
                        }
                        alt="Admin Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
                      />
                      <label className="mt-2 cursor-pointer inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800">
                        <Upload size={16} />
                        Change Photo
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) =>
                            setAdminProfileFile(e.target.files[0])
                          }
                        />
                      </label>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          value={adminData.username}
                          onChange={(e) =>
                            setAdminData({
                              ...adminData,
                              username: e.target.value,
                            })
                          }
                          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={adminData.email}
                          onChange={(e) =>
                            setAdminData({
                              ...adminData,
                              email: e.target.value,
                            })
                          }
                          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={adminData.current_password}
                          onChange={(e) =>
                            setAdminData({
                              ...adminData,
                              current_password: e.target.value,
                            })
                          }
                          placeholder="Required to change password"
                          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={adminData.new_password}
                          onChange={(e) =>
                            setAdminData({
                              ...adminData,
                              new_password: e.target.value,
                            })
                          }
                          placeholder="Leave blank to keep current"
                          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={adminData.confirm_password}
                          onChange={(e) =>
                            setAdminData({
                              ...adminData,
                              confirm_password: e.target.value,
                            })
                          }
                          placeholder="Confirm new password"
                          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={updateAdminProfile}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    <Save size={18} />
                    Update Profile
                  </button>
                </div>

                {/* Default User Image */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Image size={24} />
                    Default User Profile Image
                  </h2>

                  <p className="text-gray-600 mb-4">
                    This image will be used as the default profile picture for
                    new users who haven't uploaded their own.
                  </p>

                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="flex-shrink-0">
                        {defaultImageFile || defaultProfilePic ? (
                          <img
                            key={defaultProfilePic + Date.now()}
                            src={
                              defaultImageFile
                                ? URL.createObjectURL(defaultImageFile)
                                : defaultProfilePic
                            }
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                            <User size={48} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1">
                      <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
                        <Upload size={18} />
                        Select Image
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) =>
                            setDefaultImageFile(e.target.files[0])
                          }
                        />
                      </label>
                      {defaultImageFile && (
                        <p className="text-sm text-gray-600 mt-2">
                          Selected: {defaultImageFile.name}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={updateDefaultImage}
                      disabled={!defaultImageFile}
                      className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                        defaultImageFile
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}>
                      <Save size={18} />
                      Update Default Image
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Profile
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Username
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Gender
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {users.length === 0 ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-6 py-8 text-center text-gray-500">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <img
                                src={user.profile_pic}
                                alt={user.username}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            </td>
                            <td className="px-6 py-4 font-medium">
                              {user.username}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {user.email}
                            </td>
                            <td className="px-6 py-4">{user.gender}</td>
                            <td className="px-6 py-4">{user.location}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => deleteUser(user.email)}
                                className="text-red-600 hover:text-red-800">
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "sliders" && (
              <div className="space-y-4">
                <button
                  onClick={() => setAddingSlider(true)}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                  <Plus size={20} />
                  Add Slider
                </button>

                {addingSlider && (
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-bold mb-4">Add New Slider</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Title"
                        value={sliderForm.title}
                        onChange={(e) =>
                          setSliderForm({
                            ...sliderForm,
                            title: e.target.value,
                          })
                        }
                        className="border rounded px-3 py-2"
                      />
                      <input
                        type="text"
                        placeholder="Topic"
                        value={sliderForm.topic}
                        onChange={(e) =>
                          setSliderForm({
                            ...sliderForm,
                            topic: e.target.value,
                          })
                        }
                        className="border rounded px-3 py-2"
                      />
                      <textarea
                        placeholder="Description"
                        value={sliderForm.description}
                        onChange={(e) =>
                          setSliderForm({
                            ...sliderForm,
                            description: e.target.value,
                          })
                        }
                        className="border rounded px-3 py-2 col-span-2"
                        rows="3"
                      />
                      <input
                        type="number"
                        placeholder="Position"
                        value={sliderForm.position}
                        onChange={(e) =>
                          setSliderForm({
                            ...sliderForm,
                            position: e.target.value,
                          })
                        }
                        className="border rounded px-3 py-2"
                      />
                      <input
                        type="file"
                        onChange={(e) =>
                          setSliderForm({
                            ...sliderForm,
                            image: e.target.files[0],
                          })
                        }
                        className="border rounded px-3 py-2"
                        accept="image/*"
                      />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={addSlider}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        <Save size={18} />
                      </button>
                      <button
                        onClick={() => setAddingSlider(false)}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid gap-4">
                  {sliders.map((slider) => (
                    <div
                      key={slider.id}
                      className="bg-white p-6 rounded-lg shadow flex gap-4">
                      <img
                        src={slider.image}
                        alt={slider.title}
                        className="h-64 w-80 object-contain rounded bg-gray-100 flex-shrink-0"
                      />
                      {editingSlider?.id === slider.id ? (
                        <div className="flex-1">
                          <input
                            type="text"
                            value={editingSlider.title}
                            onChange={(e) =>
                              setEditingSlider({
                                ...editingSlider,
                                title: e.target.value,
                              })
                            }
                            className="border rounded px-3 py-2 w-full mb-2"
                          />
                          <input
                            type="text"
                            value={editingSlider.topic}
                            onChange={(e) =>
                              setEditingSlider({
                                ...editingSlider,
                                topic: e.target.value,
                              })
                            }
                            className="border rounded px-3 py-2 w-full mb-2"
                          />
                          <textarea
                            value={editingSlider.description}
                            onChange={(e) =>
                              setEditingSlider({
                                ...editingSlider,
                                description: e.target.value,
                              })
                            }
                            className="border rounded px-3 py-2 w-full mb-2"
                            rows="2"
                          />
                          <input
                            type="number"
                            value={editingSlider.position}
                            onChange={(e) =>
                              setEditingSlider({
                                ...editingSlider,
                                position: e.target.value,
                              })
                            }
                            className="border rounded px-3 py-2 w-full mb-2"
                          />
                          <input
                            type="file"
                            onChange={(e) =>
                              setEditingSlider({
                                ...editingSlider,
                                newImage: e.target.files[0],
                              })
                            }
                            className="border rounded px-3 py-2 w-full mb-2"
                            accept="image/*"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateSlider(editingSlider)}
                              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                              <Save size={18} />
                            </button>
                            <button
                              onClick={() => setEditingSlider(null)}
                              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{slider.title}</h3>
                          <p className="text-sm text-gray-600">
                            {slider.topic}
                          </p>
                          <p className="text-gray-700 mt-2">
                            {slider.description}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            Position: {slider.position}
                          </p>
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => setEditingSlider(slider)}
                              className="text-blue-600 hover:text-blue-800">
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => deleteSlider(slider.id)}
                              className="text-red-600 hover:text-red-800">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "welcome" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">Sections</h2>
                  <div className="grid gap-4">
                    {welcomeData.sections && welcomeData.sections.length > 0 ? (
                      welcomeData.sections.map((section) => (
                        <div
                          key={section.section_id}
                          className="bg-white p-6 rounded-lg shadow">
                          {editingSection?.section_id === section.section_id ? (
                            <div>
                              <input
                                type="text"
                                value={editingSection.title}
                                onChange={(e) =>
                                  setEditingSection({
                                    ...editingSection,
                                    title: e.target.value,
                                  })
                                }
                                className="border rounded px-3 py-2 w-full mb-2"
                              />
                              <input
                                type="text"
                                value={editingSection.subtitle}
                                onChange={(e) =>
                                  setEditingSection({
                                    ...editingSection,
                                    subtitle: e.target.value,
                                  })
                                }
                                className="border rounded px-3 py-2 w-full mb-2"
                              />
                              <textarea
                                value={editingSection.description}
                                onChange={(e) =>
                                  setEditingSection({
                                    ...editingSection,
                                    description: e.target.value,
                                  })
                                }
                                className="border rounded px-3 py-2 w-full mb-2"
                                rows="3"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => updateSection(editingSection)}
                                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                  <Save size={18} />
                                </button>
                                <button
                                  onClick={() => setEditingSection(null)}
                                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                                  <X size={18} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <h3 className="font-bold text-lg">
                                {section.title}
                              </h3>
                              <p className="text-sm text-indigo-600">
                                {section.subtitle}
                              </p>
                              <p className="text-gray-700 mt-2">
                                {section.description}
                              </p>
                              <button
                                onClick={() => setEditingSection(section)}
                                className="mt-4 text-blue-600 hover:text-blue-800">
                                <Edit size={18} />
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                        No sections found
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-4">Carousel Images</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {welcomeData.carousels &&
                    welcomeData.carousels.length > 0 ? (
                      welcomeData.carousels.map((carousel) => (
                        <div
                          key={carousel.image_id}
                          className="bg-white p-4 rounded-lg shadow">
                          <img
                            src={carousel.image}
                            alt="Carousel"
                            className="w-full h-64 object-contain rounded mb-2 bg-gray-100"
                          />
                          {editingCarousel?.image_id === carousel.image_id ? (
                            <div>
                              <input
                                type="number"
                                value={editingCarousel.sort_order}
                                onChange={(e) =>
                                  setEditingCarousel({
                                    ...editingCarousel,
                                    sort_order: e.target.value,
                                  })
                                }
                                className="border rounded px-3 py-2 w-full mb-2"
                                placeholder="Sort Order"
                              />
                              <input
                                type="file"
                                onChange={(e) =>
                                  setEditingCarousel({
                                    ...editingCarousel,
                                    newImage: e.target.files[0],
                                  })
                                }
                                className="border rounded px-3 py-2 w-full mb-2"
                                accept="image/*"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    updateCarousel(editingCarousel)
                                  }
                                  className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingCarousel(null)}
                                  className="bg-gray-400 text-white px-3 py-1 rounded text-sm">
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm text-gray-600">
                                Position: {carousel.position}
                              </p>
                              <p className="text-sm text-gray-600">
                                Order: {carousel.sort_order}
                              </p>
                              <button
                                onClick={() => setEditingCarousel(carousel)}
                                className="mt-2 text-blue-600 hover:text-blue-800">
                                <Edit size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 bg-white p-6 rounded-lg shadow text-center text-gray-500">
                        No carousel images found
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-4">Parallax Images</h2>
                  <div className="grid gap-4">
                    {welcomeData.parallax && welcomeData.parallax.length > 0 ? (
                      welcomeData.parallax.map((parallax) => {
                        const isEditing =
                          editingParallax &&
                          ((parallax.parallax_id &&
                            editingParallax.parallax_id ===
                              parallax.parallax_id) ||
                            (parallax.id &&
                              editingParallax.id === parallax.id));

                        return (
                          <div
                            key={parallax.parallax_id || parallax.id}
                            className="bg-white p-6 rounded-lg shadow flex gap-4">
                            <img
                              src={parallax.image}
                              alt="Parallax"
                              className="h-56 w-80 object-contain rounded bg-gray-100 flex-shrink-0"
                            />
                            {isEditing ? (
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={editingParallax.heading || ""}
                                  onChange={(e) =>
                                    setEditingParallax({
                                      ...editingParallax,
                                      heading: e.target.value,
                                    })
                                  }
                                  className="border rounded px-3 py-2 w-full mb-2"
                                />
                                <input
                                  type="text"
                                  value={editingParallax.subheading || ""}
                                  onChange={(e) =>
                                    setEditingParallax({
                                      ...editingParallax,
                                      subheading: e.target.value,
                                    })
                                  }
                                  className="border rounded px-3 py-2 w-full mb-2"
                                />
                                <input
                                  type="file"
                                  onChange={(e) =>
                                    setEditingParallax({
                                      ...editingParallax,
                                      newImage: e.target.files[0],
                                    })
                                  }
                                  className="border rounded px-3 py-2 w-full mb-2"
                                  accept="image/*"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      updateParallax(editingParallax)
                                    }
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                    <Save size={18} />
                                  </button>
                                  <button
                                    onClick={() => setEditingParallax(null)}
                                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                                    <X size={18} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex-1">
                                <h3 className="font-bold text-lg">
                                  {parallax.subheading}
                                </h3>
                                <p className="text-gray-700">
                                  {parallax.heading}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                  Position: {parallax.position}
                                </p>
                                <button
                                  onClick={() => setEditingParallax(parallax)}
                                  className="mt-4 text-blue-600 hover:text-blue-800">
                                  <Edit size={18} />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                        No parallax images found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;