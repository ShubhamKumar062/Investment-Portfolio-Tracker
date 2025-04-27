import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiPieChart, 
  FiBarChart2, 
  FiLogOut,
  FiMenu,
  FiX 
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const navigationItems = [
    { name: 'Dashboard', icon: <FiHome size={20} />, path: '/dashboard' },
    { name: 'Portfolio', icon: <FiPieChart size={20} />, path: '/portfolio' },
    { name: 'Compare', icon: <FiBarChart2 size={20} />, path: '/compare' }
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const sidebarVariants = {
    expanded: { width: '240px' },
    collapsed: { width: '80px' }
  };

  const mobileSidebarVariants = {
    open: { 
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    closed: { 
      x: '-100%',
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div 
        className="hidden lg:flex flex-col h-screen glass-card border-r border-white border-opacity-10 fixed left-0 top-0 z-20"
        variants={sidebarVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        initial="expanded"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-2xl font-bold text-white"
            >
              Investfolio
            </motion.div>
          )}
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-full hover:bg-white hover:bg-opacity-10 text-white"
          >
            {isCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
          </button>
        </div>

        <div className="flex flex-col flex-grow overflow-y-auto">
          <div className="flex flex-col space-y-1 p-3">
            {navigationItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center py-3 px-4 rounded-xl transition-all duration-200
                  ${isActive ? 'bg-primary-500 text-white' : 'text-white hover:bg-white hover:bg-opacity-10'}
                `}
              >
                <div className="flex items-center">
                  <span>{item.icon}</span>
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="ml-3 font-medium"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </div>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-white border-opacity-10">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3 p-2">
              <img 
                src={currentUser?.avatarUrl || 'https://ui-avatars.com/api/?name=User&background=random'} 
                alt="Profile" 
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="font-medium text-white">
                  {currentUser?.name || 'User'}
                </div>
                <div className="text-sm text-gray-400">
                  {currentUser?.email || 'user@example.com'}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center p-2">
              <img 
                src={currentUser?.avatarUrl || `https://ui-avatars.com/api/?name=Pratik&background=random`} 
                alt="Profiles" 
                className="w-10 h-10 rounded-full"
              />
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="mt-4 w-full flex items-center justify-center py-2 px-4 rounded-xl bg-error-500 hover:bg-error-600 text-white transition-all duration-200"
          >
            <FiLogOut size={18} />
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button 
          onClick={toggleMobileSidebar}
          className="p-2 rounded-full bg-primary-500 text-white"
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <motion.div 
        className="lg:hidden fixed inset-0 z-20 glass-card"
        variants={mobileSidebarVariants}
        initial="closed"
        animate={isMobileOpen ? 'open' : 'closed'}
        style={{ 
          width: '80%', 
          maxWidth: '300px',
          height: '100vh',
          display: isMobileOpen ? 'block' : 'block'
        }}
      >
        <div className="flex items-center justify-between p-4 border-b border-white border-opacity-10">
          <div className="text-2xl font-bold text-white">Investfolio</div>
          <button 
            onClick={toggleMobileSidebar} 
            className="p-2 rounded-full hover:bg-white hover:bg-opacity-10 text-white"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex flex-col p-3 space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center py-3 px-4 rounded-xl transition-all duration-200
                ${isActive ? 'bg-primary-500 text-white' : 'text-white hover:bg-white hover:bg-opacity-10'}
              `}
            >
              <span>{item.icon}</span>
              <span className="ml-3 font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white border-opacity-10">
          <div className="flex items-center space-x-3 p-2">
            <img 
              src={currentUser?.avatarUrl || 'https://ui-avatars.com/api/?name=User&background=random'} 
              alt="Profile" 
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="font-medium text-white">
                {currentUser?.name || 'User'}
              </div>
              <div className="text-sm text-gray-400">
                {currentUser?.email || 'user@example.com'}
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-4 w-full flex items-center justify-center py-2 px-4 rounded-xl bg-error-500 hover:bg-error-600 text-white transition-all duration-200"
          >
            <FiLogOut size={18} />
            <span className="ml-2">Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Overlay for mobile menu */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleMobileSidebar}
        ></div>
      )}
    </>
  );
}