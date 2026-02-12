import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, LogOut, List, X } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import clsx from 'clsx';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
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
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <div className={clsx(
                "fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white flex flex-col pt-5 pb-4 transition-transform duration-300 ease-in-out",
                "md:relative md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="px-4 mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold tracking-wider">IssueTracker</h2>
                    {/* Close button - only visible on mobile */}
                    <button
                        onClick={onClose}
                        className="md:hidden text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md p-1"
                        aria-label="Close menu"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex-1 px-2 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={() => onClose()} // Close sidebar on mobile when clicking a link
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
        </>
    );
}
