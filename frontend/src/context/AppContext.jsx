import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContent = createContext();

export const AppContentProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    // Fetch token only once to avoid redundant localStorage access
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!token);
    const [userData, setUserData] = useState(null);
    const [assets, setAssets] = useState([]);
    const [portfolioData, setPortfolioData] = useState({
        assets: [],
        performanceHistory: [],
        totalValue: 0,
        totalProfit: 0,
        profitPercentage: 0
    });

    // Helper function to get auth headers - memoized
    const getAuthHeaders = useCallback(() => {
        return {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        };
    }, [token]);

    // Fetch user data
    const getUserData = useCallback(async () => {
        if (!token) return;
        
        const source = axios.CancelToken.source();
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/user/get-user`, 
                {
                    ...getAuthHeaders(),
                    cancelToken: source.token,
                    timeout: 10000
                }
            );
    
            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            if (!axios.isCancel(error)) {
                console.error("Failed to fetch user data:", error);
                toast.error(error?.response?.data?.message || "Failed to fetch user data");
            }
        }
        return () => source.cancel('Request canceled by component unmount');
    }, [backendUrl, token, getAuthHeaders]);

    // Check authentication state
    const getAuthState = useCallback(async () => {
        if (!token) return;
        
        console.log("Token in localStorage:", token ? `${token.substring(0, 10)}...` : 'Not found');
        const source = axios.CancelToken.source();
        
        try {
            console.log("Sending auth check request with token");
            const response = await axios.get(
                `${backendUrl}/api/user/is-auth`, 
                {
                    ...getAuthHeaders(),
                    cancelToken: source.token,
                    timeout: 10000
                }
            );
            
            console.log("Auth check response:", response.data);
            
            if (response.data.success) {
                setIsLoggedIn(true);
                await getUserData();
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            if (!axios.isCancel(error)) {
                console.error("Auth check error details:", {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
                setIsLoggedIn(false);
            }
        }
        return () => source.cancel('Request canceled by component unmount');
    }, [backendUrl, token, getAuthHeaders, getUserData]);

    // Login function
    const login = useCallback(async (credentials) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/auth/login`, 
                credentials
            );
            
            if (data.success) {
                localStorage.setItem('token', data.token);
                setToken(data.token);
                setIsLoggedIn(true);
                await getUserData();
                toast.success("Login successful");
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error?.response?.data?.message || "Login failed");
            return false;
        }
    }, [backendUrl, getUserData]);

    // Logout function
    const logout = useCallback(async () => {
        try {
            // Optional: Call logout endpoint if you have one
            // await axios.post(`${backendUrl}/api/auth/logout`, {}, getAuthHeaders());
            
            // Clear local storage and state
            localStorage.removeItem('token');
            setToken(null);
            setIsLoggedIn(false);
            setUserData(null);
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Logout failed");
        }
    }, []);
    
    // Check auth state on mount or token change
    useEffect(() => {
        if (token) {
            getAuthState();
        }
    }, [token, getAuthState]);
    
    // Asset management functions
    const updatePortfolioData = useCallback((currentAssets) => {
        // Avoid division by zero
        const totalInvestment = currentAssets.reduce((sum, asset) => sum + asset.initialValue, 0);
        const totalValue = currentAssets.reduce((sum, asset) => sum + asset.value, 0);
        const totalProfit = totalValue - totalInvestment;
        
        // Calculate profit percentage safely
        const profitPercentage = totalInvestment > 0 
            ? (totalProfit / totalInvestment) * 100 
            : 0;

        setPortfolioData({
            assets: currentAssets,
            performanceHistory: [], // This would be updated with real data
            totalValue,
            totalProfit,
            profitPercentage
        });
    }, []);

    const addAsset = useCallback((asset) => {
        setAssets(prevAssets => {
            const updatedAssets = [...prevAssets, asset];
            updatePortfolioData(updatedAssets);
            return updatedAssets;
        });
    }, [updatePortfolioData]);

    const removeAsset = useCallback((assetId) => {
        setAssets(prevAssets => {
            const updatedAssets = prevAssets.filter(asset => asset.id !== assetId);
            updatePortfolioData(updatedAssets);
            return updatedAssets;
        });
    }, [updatePortfolioData]);

    const updateAsset = useCallback((updatedAsset) => {
        setAssets(prevAssets => {
            const updatedAssets = prevAssets.map(asset => 
                asset.id === updatedAsset.id ? updatedAsset : asset
            );
            updatePortfolioData(updatedAssets);
            return updatedAssets;
        });
    }, [updatePortfolioData]);

    // Memoize context value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        assets,
        setAssets,
        portfolioData,
        token,
        setToken,
        addAsset,
        removeAsset,
        updateAsset,
        getUserData,
        login,
        logout
    }), [
        backendUrl, 
        isLoggedIn, 
        userData, 
        assets, 
        portfolioData,
        token,
        addAsset,
        removeAsset,
        updateAsset,
        getUserData,
        login,
        logout
    ]);

    return (
       <AppContent.Provider value={value}>
        {children}
       </AppContent.Provider>
    );
};