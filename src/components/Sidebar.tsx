import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, LogOut, List } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import clsx from 'clsx';

const Sidebar: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Issues', path: '/issues', icon: List },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    return (
        <div className="h-screen w-64 bg-gray-900 text-white flex flex-col pt-5 pb-4">
            <div className="px-4 mb-6">
                <h2 className="text-2xl font-bold tracking-wider">IssueTracker</h2>
            </div>
            <nav className="flex-1 px-2 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            clsx(
                                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                                isActive
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            )
                        }
                    >
                        <item.icon className="mr-3 h-6 w-6 flex-shrink-0" />
                        {item.name}
                    </NavLink>
                ))}
            </nav>
            <div className="px-2 mt-auto">
                <button
                    onClick={handleLogout}
                    className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
                >
                    <LogOut className="mr-3 h-6 w-6 flex-shrink-0" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
