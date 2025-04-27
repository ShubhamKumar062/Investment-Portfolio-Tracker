import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight, FiCheck, FiBarChart2, FiPieChart, FiTrendingUp } from 'react-icons/fi';
import ChatBotToggle from '../components/chatbot';

// Hero section background
const heroBgUrl = 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=1600';

// Team members data
const teamMembers = [
  {
    name: "Shubham Kumar",
    role: "Project Lead",
    image: "https://i.postimg.cc/8c7s9L51/Whats-App-Image-2025-04-27-at-9-18-16-PM.jpg", 
    description: "Lead developer and architect of Investfolio. Responsible for overall project direction and implementation.",
    social: {
      linkedin: "https://www.linkedin.com/in/shubham-kumar-57849030a/",
      github: "https://github.com/ShubhamKumar062"
    }
  },
  {
    name: "Pratik Zajam",
    role: "FullStack Developer",
    image: "https://i.postimg.cc/3JBJ1L9g/Whats-App-Image-2025-04-27-at-8-55-01-PM.jpg", 
    description: "Specializes in React development and UI/UX design. Created the interactive dashboard and visualization components.",
    social: {
      linkedin: "https://www.linkedin.com/in/pratik-zajam/",
      github: "https://github.com/pratikzajam"
    }
  },
  {
    name: "Ayesha Shaw",
    role: "FullStack Developer",
    image: "https://i.postimg.cc/HxhkwjtF/Whats-App-Image-2025-04-27-at-9-00-00-PM.jpg",
    description: "Handles server-side logic, database architecture, and API integrations for real-time data processing.",
    social: {
      linkedin: "https://www.linkedin.com/in/ayesha-shaw/",
      github: "https://github.com/ayeshashaw"
    }
  }
];

// Testimonial images
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Investment Analyst",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200",
    quote: "Investfolio has transformed how I track my investments. The real-time analytics are incredible!"
  },
  {
    name: "Michael Chen",
    role: "Day Trader",
    image: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200",
    quote: "The portfolio tracking features are unmatched. It's become an essential tool for my daily trading."
  },
  {
    name: "Emma Davis",
    role: "Financial Advisor",
    image: "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=200",
    quote: "I recommend Investfolio to all my clients. It's intuitive and powerful at the same time."
  }
];

// Features data
const features = [
  {
    icon: <FiPieChart size={24} />,
    title: "Portfolio Analytics",
    description: "Get detailed insights into your investment portfolio with real-time analytics and performance metrics."
  },
  {
    icon: <FiBarChart2 size={24} />,
    title: "Market Tracking",
    description: "Track market trends and asset performance with interactive charts and customizable dashboards."
  },
  {
    icon: <FiTrendingUp size={24} />,
    title: "Investment Growth",
    description: "Monitor your investment growth over time and make data-driven decisions for your portfolio."
  }
];

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { scrollYProgress } = useScroll();
  
  const featuresY = useTransform(scrollYProgress, [0, 0.3], [100, 0]);
  const testimonialsOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);
  
  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-white font-bold">IF</span>
              </motion.div>
              <span className="text-white font-bold text-xl">Investfolio</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/login"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/signup"
                className="btn-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center py-20 px-4"
        style={{
          backgroundImage: `url(${heroBgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Track Your Investments
            <br />
            <span className="text-primary-500">Like Never Before</span>
          </motion.h1>
          
          <motion.p
            className="text-xl text-gray-300 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Get real-time insights into your portfolio performance
            <br />
            and make smarter investment decisions.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link 
              to="/signup" 
              className="btn-primary px-8 py-3 text-lg flex items-center group"
            >
              Start Free Trial
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/login" 
              className="btn-ghost px-8 py-3 text-lg"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <motion.div 
          className="max-w-7xl mx-auto"
          style={{ y: featuresY }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Investfolio?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Get all the tools you need to make informed investment decisions and grow your portfolio.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass-card p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 bg-primary-500 bg-opacity-20 rounded-lg flex items-center justify-center text-primary-500 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Team
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Meet the talented individuals behind Investfolio
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className="glass-card p-6 rounded-xl flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-32 h-32 rounded-full mb-4 object-cover border-2 border-primary-500"
                />
                <h3 className="text-xl font-semibold text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-500 mb-4">
                  {member.role}
                </p>
                <p className="text-gray-400 mb-6">
                  {member.description}
                </p>
                <div className="flex space-x-4 mt-auto">
                 
                  <a href={member.social.linkedin} className="text-gray-400 hover:text-primary-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a href={member.social.github} className="text-gray-400 hover:text-primary-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gray-900">
        <motion.div 
          className="max-w-7xl mx-auto"
          style={{ opacity: testimonialsOpacity }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join thousands of investors who trust Investfolio to manage their portfolios.
            </p>
          </div>
          
          <div className="relative h-[400px]">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="absolute inset-0 flex flex-col items-center text-center p-8 glass-card rounded-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: currentTestimonial === index ? 1 : 0,
                  scale: currentTestimonial === index ? 1 : 0.9,
                }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full mb-4"
                />
                <p className="text-xl text-white mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <h3 className="text-lg font-semibold text-white">
                  {testimonial.name}
                </h3>
                <p className="text-gray-400">
                  {testimonial.role}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div 
          className="max-w-4xl mx-auto text-center glass-card p-12 rounded-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of investors who trust Investfolio to manage their portfolios.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/signup" 
              className="btn-primary px-8 py-3 text-lg flex items-center group"
            >
              Get Started Now
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center text-gray-400">
              <FiCheck className="mr-2 text-accent-500" />
              14-day free trial
            </div>
          </div>
        </motion.div>
      </section>

        <ChatBotToggle />
      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">IF</span>
                </div>
                <span className="text-white font-bold text-xl">Investfolio</span>
              </Link>
              <p className="text-gray-400">
                Track, analyze and optimize your investments with our powerful portfolio management tools.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 Investfolio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}