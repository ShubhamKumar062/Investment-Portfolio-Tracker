import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login function
  const login = (email, password) => {
    // In a real app, this would make an API call to authenticate
    // For this demo, we'll just simulate a successful login
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple validation
        if (email && password) {
          const user = {
            id: 'user-123',
            email: email,
            name: email.split('@')[0],
            avatarUrl: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
          };
          setCurrentUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  // Mock signup function
  const signup = (email, password, name) => {
    // In a real app, this would make an API call to create a new user
    // For this demo, we'll just simulate a successful registration
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple validation
        if (email && password && name) {
          const user = {
            id: 'user-' + Date.now(),
            email: email,
            name: name,
            avatarUrl: `https://ui-avatars.com/api/?name=${name}&background=random`
          };
          setCurrentUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Please fill all required fields'));
        }
      }, 1000);
    });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}