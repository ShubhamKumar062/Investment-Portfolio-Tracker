import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'assets', label: 'Assets', icon: '💰', path: '/dashboard/assets' },
    { id: 'comparison', label: 'Compare', icon: '📈', path: '/dashboard/comparison' },
  ];

  return (

    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <nav className="sidebar-nav">
        <ul>
          {navItems.map(item => (
            <li key={item.id}>
              <Link
                to={item.path}
                className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
                aria-label={item.label}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
    </aside>
  );
};

export default Sidebar;