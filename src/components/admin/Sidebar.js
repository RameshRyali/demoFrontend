import React, { useState } from "react";
import { FaBell, FaChartLine, FaChevronLeft, FaSignOutAlt, FaTachometerAlt, FaUserPlus, FaUsers } from "react-icons/fa";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ admin, setToken, setAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setAdmin(null);
    window.location.href = "/admin/login"; // Redirect to admin login
  };

  const menuItems = [
    { icon: FaTachometerAlt, label: 'Dashboard', path: '/Sidebar/admin-dashboard', color: 'from-blue-400 to-blue-600' },
    { icon: FaBell, label: 'Notifications', path: '/Sidebar/notifications', color: 'from-purple-400 to-purple-600' },
    { icon: FaUserPlus, label: 'Add Photographer', path: '/Sidebar/add-photographer', color: 'from-green-400 to-green-600' },
    { icon: FaUsers, label: 'Photographer List', path: '/Sidebar/photographer-list', color: 'from-yellow-400 to-yellow-600' },
    { icon: FaChartLine, label: 'Analytics', path: '/Sidebar/analytics', color: 'from-pink-400 to-pink-600' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen bg-gray-800 text-white transition-all duration-300 ease-in-out z-50 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Collapse Toggle Button */}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="absolute -right-3 top-8 bg-gray-700 rounded-full p-1 hover:bg-gray-600 transition-colors duration-200 z-50">
          <FaChevronLeft className={`transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>

        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-700 flex-shrink-0">
            <div className={`flex items-center space-x-4 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xl font-bold">
                A
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <h2 className="text-lg font-semibold truncate">Admin Panel</h2>
                  <p className="text-sm text-gray-400">Dashboard</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation - Scrollable */}
          <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            <div className="px-4 py-8">
              <ul className="space-y-3">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <button onClick={() => navigate(item.path)} className={`w-full group flex items-center space-x-3 p-3 rounded-lg transition-all duration-200
                      ${isActive(item.path) ? 'bg-gradient-to-r ' + item.color + ' shadow-lg transform scale-105' : 'hover:bg-gray-700'}
                      ${isCollapsed ? 'justify-center' : ''}`}>
                      <item.icon className={`text-xl ${isActive(item.path) ? 'animate-pulse' : 'group-hover:scale-110 transition-transform duration-200'}`} />
                      {!isCollapsed && (
                        <span className={`transition-all duration-200 ${isActive(item.path) ? 'font-semibold' : 'text-gray-300 group-hover:text-white'}`}>
                          {item.label}
                        </span>
                      )}
                      {!isCollapsed && isActive(item.path) && <div className="w-2 h-2 rounded-full bg-white ml-auto animate-pulse"></div>}
                    </button>
                  </li>
                ))}

                {/* Logout Button */}
                <li className="pt-6">
                  <button onClick={handleLogout} className={`w-full group flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-red-500/10 text-red-400 hover:text-red-300 ${isCollapsed ? 'justify-center' : ''}`}>
                    <FaSignOutAlt className="text-xl group-hover:rotate-180 transition-transform duration-500" />
                    {!isCollapsed && <span>Logout</span>}
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          {/* Footer */}
          {!isCollapsed && (
            <div className="p-6 border-t border-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>&copy; 2025 AdminPro</span>
                <span className="text-xs">v1.0.0</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className={`flex-1 p-8 overflow-y-auto bg-gray-50 transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Sidebar;