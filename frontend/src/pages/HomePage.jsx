import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import ParticlesBackground from '../components/ParticlesBackground'; // ✅ import here

const HomePage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden dark:text-white text-gray-900 transition-colors duration-300">

      {/* ✅ Particle Background */}
      <ParticlesBackground />

      {/* ✅ Optional Gradient Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 z-0"></div>

      {/* ✅ Theme Toggle + Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="max-w-3xl text-center space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight animate-fade-in">
            Excel Analytics Platform 📊
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 animate-fade-in delay-200">
            Upload Excel sheets. Visualize smart charts. Make data-driven decisions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-300">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link
              to="/register"
              className="border border-blue-600 text-blue-600 dark:text-white dark:border-white px-6 py-3 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
