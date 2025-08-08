  import { Link } from "react-router-dom";
  import ThemeToggle from "../components/ThemeToggle";
  import { Github, Linkedin, Instagram, ChevronDown } from "lucide-react";
  import { useEffect, useState } from "react";

  const HomePage = () => {
    const [users, setUsers] = useState(0);
    const [files, setFiles] = useState(0);
    const [charts, setCharts] = useState(0);

    const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);

    const faqs = [
      {
        question: "What is Excel Analytics?",
        answer:
          "Excel Analytics is a powerful platform to upload, analyze, and visualize Excel data using intelligent charts.",
      },
      {
        question: "Is it free to use?",
        answer:
          "Yes, Excel Analytics offers a free plan for all users to get started with data visualization.",
      },
      {
        question: "Can I download the charts?",
        answer:
          "Yes, once generated, charts can be saved or exported from the dashboard.",
      },
      {
        question: "Is my data secure?",
        answer:
          "Absolutely! Your uploaded Excel files are stored securely and are only accessible to you.",
      },
    ];

    // Animated count up effect
    useEffect(() => {
      const animateCounter = (target, setter, max) => {
        let count = 0;
        const step = Math.ceil(max / 50);
        const interval = setInterval(() => {
          count += step;
          if (count >= max) {
            setter(max);
            clearInterval(interval);
          } else {
            setter(count);
          }
        }, 30);
      };

      animateCounter(users, setUsers, 500);
      animateCounter(files, setFiles, 1200);
      animateCounter(charts, setCharts, 300);
    }, []);

    const toggleFaq = (index) => {
      setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
    };

    return (
      <div className="relative min-h-[130vh] overflow-hidden dark:text-white text-gray-900 transition-colors duration-300 flex flex-col">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-green-300 to-blue-300 dark:from-gray-700 dark:via-gray-600 dark:to-indigo-500 animate-background"></div>
        </div>

        {/* Content */}
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

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-300">
              <Link
                to="/login"
                className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition"
              >
                Get Started
              </Link>
              <Link
                to="/register"
                className="border border-green-600 text-green-700 dark:text-white dark:border-white px-6 py-3 rounded-full hover:bg-green-50 dark:hover:bg-gray-700 transition"
              >
                Create Account
              </Link>
            </div>

            {/* Stats Section */}
            <div className="flex justify-center items-center gap-10 mt-10 text-center">
              {[
                { label: "Users", value: users },
                { label: "Files Uploaded", value: files },
                { label: "Charts Generated", value: charts },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-white/30 dark:bg-white/5 backdrop-blur shadow-md hover:scale-105 transition-transform duration-300"
                >
                  <h2 className="text-3xl font-bold text-green-800 dark:text-green-300">
                    {stat.value}+
                  </h2>
                  <p className="text-gray-800 dark:text-gray-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="relative z-10 px-6 py-12 max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Why Choose Excel Analytics?</h2>
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            {[
              {
                title: "User-Friendly",
                desc: "No coding needed — just upload your Excel files and watch the charts appear.",
              },
              {
                title: "Real-time Visualization",
                desc: "Charts are generated instantly with beautiful and responsive visuals.",
              },
              {
                title: "Secure & Private",
                desc: "Your data is encrypted and only accessible to you. Privacy is our priority.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl bg-white/30 dark:bg-white/5 backdrop-blur transition-transform duration-300 hover:scale-105 hover:shadow-2xl border border-transparent hover:border-green-400 dark:hover:border-green-300"
              >
                <h3 className="text-xl font-semibold mb-2 text-green-800 dark:text-green-300 group-hover:text-green-900 dark:group-hover:text-green-100 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-800 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white/90 transition-colors">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="relative z-10 px-6 pb-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl overflow-hidden shadow-md transition-all duration-300 border border-transparent hover:border-green-400 dark:hover:border-green-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className={`w-full flex justify-between items-center px-5 py-4 text-left 
              bg-white/50 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20 
              transition-colors duration-300 group`}
                >
                  <span className="font-medium text-gray-900 dark:text-white group-hover:text-green-900 dark:group-hover:text-green-300 transition">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`transition-transform duration-300 text-gray-700 dark:text-gray-300 group-hover:text-green-400 ${
                      expandedFaqIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`px-5 overflow-hidden transition-all duration-500 ease-in-out ${
                    expandedFaqIndex === index
                      ? "max-h-40 py-3 bg-white/30 dark:bg-white/5"
                      : "max-h-0"
                  }`}
                >
                  <p className="text-gray-800 dark:text-gray-300">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
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
