import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UploadForm = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Excel uploaded & analyzed ✅");
      setFile(null);
      onUpload();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow mb-6"
    >
      <h3 className="text-lg font-semibold mb-3">📤 Upload Excel File</h3>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full mb-4 p-2 border rounded bg-white dark:bg-slate-700 text-black dark:text-white"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
};

export default UploadForm;
