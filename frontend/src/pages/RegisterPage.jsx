import AuthForm from '../components/AuthForm';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegister = async ({ name, email, password }) => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      alert('Registered successfully! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error('Registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-indigo-100 px-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">Create Your Account 🚀</h2>
        <AuthForm type="register" onSubmit={handleRegister} />
        <p className="text-center text-sm mt-6 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-pink-600 font-medium hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
