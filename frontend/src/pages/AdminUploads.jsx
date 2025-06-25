import { useEffect, useState } from "react";
import axios from "axios";

const AdminUploads = () => {
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    const fetchAllUploads = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get("http://localhost:5000/api/upload/admin/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUploads(res.data);
      } catch (err) {
        console.error(err);
        alert("Admin upload fetch failed.");
      }
    };

    fetchAllUploads();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-100 to-purple-100 dark:from-slate-900 dark:to-slate-800">
      <h2 className="text-2xl font-bold mb-4">👑 All User Uploads</h2>
      {uploads.length === 0 ? (
        <p>No uploads found.</p>
      ) : (
        <table className="w-full border-collapse shadow rounded-xl overflow-hidden bg-white dark:bg-slate-800">
          <thead>
            <tr className="bg-blue-200 dark:bg-slate-700 text-left">
              <th className="p-3">File</th>
              <th className="p-3">User</th>
              <th className="p-3">Email</th>
              <th className="p-3">Uploaded At</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((upload) => (
              <tr key={upload._id} className="border-b border-gray-200 dark:border-slate-600">
                <td className="p-3">{upload.fileName}</td>
                <td className="p-3">{upload.user?.name}</td>
                <td className="p-3 text-sm text-gray-500">{upload.user?.email}</td>
                <td className="p-3 text-sm">
                  {new Date(upload.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUploads;
