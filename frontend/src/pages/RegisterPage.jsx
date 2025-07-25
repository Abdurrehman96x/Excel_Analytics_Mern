import AuthForm from '../components/AuthForm';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegister = async ({ name, email, password }) => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      toast.success('Registered successfully! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error('Registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-white to-purple-200 dark:from-slate-900 dark:to-slate-800 px-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-pink-600 dark:text-pink-400 mb-6">
          Create Your Account 🚀
        </h2>
        <AuthForm type="register" onSubmit={handleRegister} />
        <p className="text-center text-sm mt-6 text-gray-700 dark:text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="text-pink-600 dark:text-pink-400 font-medium hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
