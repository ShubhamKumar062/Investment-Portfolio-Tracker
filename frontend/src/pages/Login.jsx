import { useContext, useState, useEffect } from 'react';
import { Lock, Mail, User, EyeOff, Eye, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Login.css';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const { backendUrl, token, setToken, getUserData } = useContext(AppContent);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState("");

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (error) setError("");
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      axios.defaults.withCredentials = true;

      if (!isLogin) { // Sign Up
        // Check terms agreement for signup
        if (!agreeToTerms) {
          setError("You must agree to the Terms of Service and Privacy Policy");
          return;
        }
        
        // Password validation
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords don't match");
          return;
        }
        
        const response = await axios.post(`${backendUrl}/api/user/signup`, {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        
        if (response.data.success) {
          localStorage.setItem('token', response.data.token);
          setToken(response.data.token);
          toast.success("Sign up successful!");
          getUserData();
          
          if (onLogin) onLogin({ name: formData.name, email: formData.email });
        } else {
          toast.error(response.data.message);
        }
      } else { // Login
        const response = await axios.post(`${backendUrl}/api/user/login`, {
          email: formData.email,
          password: formData.password,
          rememberMe: rememberMe
        }, { withCredentials: true });
        
        if (response.data.success) {
          localStorage.setItem('token', response.data.token);
          setToken(response.data.token);
          toast.success("Login successful!");
          getUserData();
          
          if (onLogin) onLogin({ email: formData.email });
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      setError(error.response?.data?.message || "Authentication failed");
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {isLogin ? "Login to Your Account" : "Create Your Account"}
          </h2>
          <button onClick={() => navigate('/')} className="close-button">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-container">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-container">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="demo@example.com"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="••••••"
                required
              />
              <button 
                type="button"
                onClick={togglePasswordVisibility}
                className="toggle-password-btn"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-container">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
          )}

          {isLogin ? (
            <div className="login-options">
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="checkbox-input"
                />
                <label htmlFor="rememberMe" className="checkbox-label">Remember me</label>
              </div>
              
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>
          ) : (
            <div className="checkbox-container terms-container">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeToTerms}
                onChange={() => setAgreeToTerms(!agreeToTerms)}
                className="checkbox-input"
                required
              />
              <label htmlFor="agreeTerms" className="checkbox-label">
                I agree to the <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="terms-link">Privacy Policy</a>
              </label>
            </div>
          )}
        
          <button
            type="submit"
            className="submit-button"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        
        <div className="form-footer">
          {isLogin ? (
            <p>
              Don't have an account? <a onClick={() => setIsLogin(false)} className="auth-link">Sign up</a>
            </p>
          ) : (
            <p>
              Already have an account? <a onClick={() => setIsLogin(true)} className="auth-link">Sign in</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;