import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, PenLine, Bell, LogOut, ChevronRight, Settings, HelpCircle } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';

const Sidebar = () => {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <Home size={20} />,
    },
    {
      name: 'Text Notes',
      path: '/text-notes',
      icon: <FileText size={20} />,
    },
    {
      name: 'Drawing Notes',
      path: '/drawing-notes',
      icon: <PenLine size={20} />,
    },
    {
      name: 'Reminder Notes',
      path: '/reminder-notes',
      icon: <Bell size={20} />,
    },
  ];

  return (
    <div className={`h-screen ${collapsed ? 'w-20' : 'w-64'} sticky top-0 bg-white border-r border-gray-200 flex flex-col shadow-sm transition-all duration-300 z-20`}>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && <h1 className="text-xl font-bold text-amber-500">Kreon Notes</h1>}
        {collapsed && <div className="w-full flex justify-center">
          <span className="text-2xl font-bold text-amber-500">K</span>
        </div>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <ChevronRight size={14} className={`transform ${collapsed ? 'rotate-180' : ''} transition-transform duration-300`} />
        </button>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className={`mb-6 ${collapsed ? 'text-center' : ''}`}>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
            {!collapsed && 'Main Menu'}
            {collapsed && '•••'}
          </span>
        </div>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive(item.path)
                  ? 'bg-amber-50 text-amber-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
                title={collapsed ? item.name : ''}
              >
                <div className={isActive(item.path) ? 'text-amber-500' : 'text-gray-500'}>
                  {item.icon}
                </div>
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>

        <div className={`mt-8 mb-2 ${collapsed ? 'text-center' : ''}`}>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
            {!collapsed && 'Support'}
            {collapsed && '•••'}
          </span>
        </div>
        <ul className="space-y-2">
          <li>
            <Link
              to="/settings"
              className="flex items-center gap-3 p-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-50"
              title={collapsed ? 'Settings' : ''}
            >
              <Settings size={20} className="text-gray-500" />
              {!collapsed && <span>Settings</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/help"
              className="flex items-center gap-3 p-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-50"
              title={collapsed ? 'Help & Support' : ''}
            >
              <HelpCircle size={20} className="text-gray-500" />
              {!collapsed && <span>Help & Support</span>}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        {!collapsed && (
          <div className="flex items-center gap-3 mb-4 p-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => signOut()}
          className={`flex items-center gap-3 p-3 w-full rounded-lg text-gray-600 hover:bg-gray-50 transition-colors ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Sign Out' : ''}
        >
          <LogOut size={20} className="text-red-500" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;