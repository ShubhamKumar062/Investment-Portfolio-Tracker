import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";






const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Real login function
  const login = async (email, password) => {
    try {
      const response = await fetch('https://investment-backend.vercel.app/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      const { token } = data;

      // Decode token to get user info using jwt_decode
      const decoded = jwtDecode(token); // ✅ use jwt_decode here

      console.log(decoded)

      const user = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        token,
      };

      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      return user;
    } catch (error) {
      throw error;
    }
  };
  // Real signup function
  const signup = async (name, email, password) => {
    try {
      const response = await fetch('https://investment-backend.vercel.app/api/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to signup');
      }

      const user = await response.json();
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
