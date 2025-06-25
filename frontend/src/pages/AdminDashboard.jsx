import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Unauthorized or failed to load users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
  <div className="min-h-screen p-6 bg-gradient-to-br from-slate-100 to-purple-100 dark:from-[#0f172a] dark:to-[#1e293b]">
    <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">👑 Admin Dashboard</h2>

    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-100">👥 Total Users</h3>
        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{users.length}</p>
      </div>

      {/* Add more cards: data usage, recent uploads, etc. */}
    </div>

    <div className="mt-8 bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">All Users</h3>
      <ul className="space-y-3">
        {users.map((user) => (
          <li key={user._id} className="p-3 border-b dark:border-slate-600">
            <p className="font-medium text-slate-800 dark:text-white">{user.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email} — <span className="uppercase">{user.role}</span></p>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
};

export default AdminDashboard;
