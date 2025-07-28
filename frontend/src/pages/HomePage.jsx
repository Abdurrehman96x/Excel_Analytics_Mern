import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { Github, Linkedin, Instagram } from "lucide-react"; 

const HomePage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden dark:text-white text-gray-900 transition-colors duration-300 flex flex-col">
      {/* ✅ Animated Background (Gradient Waves) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-green-300 to-blue-300 dark:from-gray-700 dark:via-gray-600 dark:to-indigo-500 animate-background"></div>
      </div>

      {/* ✅ Hero Content */}
      <div className="relative z-10 flex-grow flex flex-col items-center justify-center px-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="max-w-3xl text-center space-y-6">
          <img
            src="/assets/excel_analytics_logo.png"
            alt="Excel Analytics Logo"
            className="w-36 h-36 sm:w-40 sm:h-40 mx-auto drop-shadow-lg"
          />
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Excel Analytics Platform
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 animate-fade-in delay-200">
            Upload Excel sheets. Visualize smart charts. Make data-driven
            decisions.
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

      {/* ✅ Footer */}
      <footer className="relative z-10 text-center text-sm text-gray-600 dark:text-gray-300 py-6 bg-white/30 dark:bg-white/5 border-t border-white/20">
        <p>
          © 2025 Excel Analytics by{" "}
          <span className="font-semibold text-gray-800 dark:text-white">
            Abdur Rehman Malik
          </span>
        </p>
        <div className="flex justify-center gap-4 mt-2">
          <a
            href="https://github.com/abdurmalikdev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black dark:hover:text-white transition"
          >
            <Github size={20} />
          </a>
          <a
            href="https://linkedin.com/in/abdurmalikdev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700 dark:hover:text-blue-400 transition"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://instagram.com/abdurmalikdev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-600 dark:hover:text-pink-400 transition"
          >
            <Instagram size={20} />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
