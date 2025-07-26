import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token");
      try {
        const [userRes, uploadRes, chartRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/uploads", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/charts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUsers(userRes.data);
        setUploads(uploadRes.data);
        setCharts(chartRes.data);
        console.log("Charts Data:", chartRes.data); 
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
    const chartUserId = typeof c.user === 'string' ? c.user : c.user?._id;
    return chartUserId === userId;
  }).length;
};

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-100 to-purple-100 dark:from-[#0f172a] dark:to-[#1e293b]">
      <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">👑 Admin Dashboard</h2>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-100">👥 Total Users</h3>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{users.length}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-100">📤 Total Uploads</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{uploads.length}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-100">📊 Total Charts</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{charts.length}</p>
        </div>
      </div>

      <div className="mt-10 bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">All Users Overview</h3>
          <input
            type="text"
            placeholder="Search by name or email"
            className="p-2 rounded border dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                <tr key={user._id} className="border-b dark:border-slate-600">
                  <td className="p-3 font-medium text-slate-800 dark:text-white">{user.name}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{user.email}</td>
                  <td className="p-3 uppercase text-sm text-gray-500 dark:text-gray-400">{user.role}</td>
                  <td className="p-3 text-blue-600 dark:text-blue-400 font-semibold">{getUserUploadsCount(user._id)}</td>
                  <td className="p-3 text-green-600 dark:text-green-400 font-semibold">{getUserChartsCount(user._id)}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
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
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">📁 Recent Uploads</h3>
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
                <tr key={upload._id} className="border-b dark:border-slate-600">
                  <td className="p-3">{upload.fileName}</td>
                  <td className="p-3">{upload.user?.name}</td>
                  <td className="p-3 text-gray-500">{upload.user?.email}</td>
                  <td className="p-3 text-sm">{new Date(upload.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
