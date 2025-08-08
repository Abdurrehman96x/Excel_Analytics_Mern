import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ThemeToggle from "../components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Github, Linkedin, Instagram } from "lucide-react";
import { Search } from "lucide-react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token");
      try {
        const [userRes, uploadRes, chartRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/uploads`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/charts`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUsers(userRes.data);
        setUploads(uploadRes.data);
        setCharts(chartRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch admin data");
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const getUserUploadsCount = (userId) => {
    return uploads.filter((u) => u.user?._id === userId).length;
  };

  const getUserChartsCount = (userId) => {
    return charts.filter((c) => {
      const chartUserId = typeof c.user === "string" ? c.user : c.user?._id;
      return chartUserId === userId;
    }).length;
  };

  const confirmDeleteUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async () => {
    const token = localStorage.getItem("token");
    if (!selectedUser) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/user/${selectedUser._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(users.filter((user) => user._id !== selectedUser._id));
      toast.success("User deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
    setShowModal(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-purple-100 dark:from-[#0f172a] dark:to-[#1e293b] text-gray-900 dark:text-white">
      <header className="flex items-center justify-between px-6 py-4 bg-white/30 dark:bg-white/5 backdrop-blur-md border-b border-white/20 sticky top-0 z-10 shadow-md h-20">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/assets/excel_analytics_logo.png"
            alt="Excel Analytics Logo"
            className="w-14 h-14 sm:w-16 sm:h-16"
          />
          <h1 className="text-2xl font-semibold"> Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-6 space-y-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-gradient-to-r from-purple-200 to-purple-400 dark:from-purple-800 dark:to-purple-600 p-6 rounded-2xl shadow-lg h-40 hover:scale-105 transition cursor-pointer">
            <h3 className="text-2xl font-semibold mb-2">👥 Total Users</h3>
            <p className="text-3xl font-bold">{users.length}</p>
          </div>

          <div className="bg-gradient-to-r from-blue-200 to-blue-400 dark:from-blue-800 dark:to-blue-600 p-6 rounded-2xl shadow-lg h-40 hover:scale-105 transition cursor-pointer">
            <h3 className="text-2xl font-semibold mb-2">📤 Total Uploads</h3>
            <p className="text-3xl font-bold">{uploads.length}</p>
          </div>

          <div className="bg-gradient-to-r from-green-200 to-green-400 dark:from-green-800 dark:to-green-600 p-6 rounded-2xl shadow-lg h-40 hover:scale-105 transition cursor-pointer">
            <h3 className="text-2xl font-semibold mb-2">📊 Total Charts</h3>
            <p className="text-3xl font-bold">{charts.length}</p>
          </div>
        </div>

        <div className="mt-10 bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <h3 className="text-xl font-semibold">All Users Overview</h3>

            {/* Search Input with Icon */}
            <div className="relative w-full sm:w-72">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by name or email"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Uploads</th>
                  <th className="p-3 text-left">Charts</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <td className="p-3 font-medium">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3 uppercase text-sm">{user.role}</td>
                    <td className="p-3 text-blue-600 font-semibold">
                      {getUserUploadsCount(user._id)}
                    </td>
                    <td className="p-3 text-green-600 font-semibold">
                      {getUserChartsCount(user._id)}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => confirmDeleteUser(user)}
                        className="text-red-500 hover:text-red-700 font-semibold"
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

        <div className="mt-10 bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4">📁 Recent Uploads</h3>
          {uploads.length === 0 ? (
            <p className="text-gray-500">No uploads found.</p>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="p-3 text-left">File Name</th>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {uploads.slice(0, 10).map((upload) => (
                  <tr
                    key={upload._id}
                    className="border-b dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <td className="p-3">{upload.fileName}</td>
                    <td className="p-3">{upload.user?.name}</td>
                    <td className="p-3">{upload.user?.email}</td>
                    <td className="p-3 text-sm">
                      {new Date(upload.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {showModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-yellow-500" size={24} />
              <h2 className="text-xl font-bold">Confirm Deletion</h2>
            </div>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete{" "}
              <strong>{selectedUser.name}</strong>? This action cannot be
              undone.
            </p>
            {selectedUser.role === "admin" && (
              <p className="mb-4 text-red-600 dark:text-red-400 font-semibold">
                ⚠ WARNING: You are about to delete another ADMIN. Are you
                absolutely sure?
              </p>
            )}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="text-center text-m text-gray-500 py-6 mt-10 bg-white/30 dark:bg-white/5 border-t border-white/20">
        <p>
          © 2025 Excel Analytics by{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            Abdur Rehman Malik
          </span>
        </p>
        <div className="flex justify-center gap-4 mt-2">
          <a
            href="https://github.com/Abdurrehman96x"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black dark:hover:text-white transition"
          >
            <Github size={25} />
          </a>
          <a
            href="https://www.linkedin.com/in/abdur-rehman-malik-2a2b62239/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700 dark:hover:text-blue-400 transition"
          >
            <Linkedin size={25} />
          </a>
          <a
            href="https://www.instagram.com/abdur.rehman96x_/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-600 dark:hover:text-pink-400 transition"
          >
            <Instagram size={25} />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
