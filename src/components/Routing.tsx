import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Authentication/LoginPage';
import SignupPage from './Authentication/SignupPage';
import Dashboard from './Dashboard';
import UserProfile from './UserProfile';
import Layout from './Layout';
import IssueList from './Issues/IssueList';
import CreateIssue from './Issues/CreateIssue';
import IssueDetail from './Issues/IssueDetail';
import { useAuth } from './context/AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

const Routing: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Private Routes wrapped in Layout */}
            <Route
                element={
                    <PrivateRoute>
                        <Layout />
                    </PrivateRoute>
                }
            >
                <Route path="/" element={<Dashboard />} />
                <Route path="/issues" element={<IssueList />} />
                <Route path="/issues/new" element={<CreateIssue />} />
                <Route path="/issues/:title" element={<IssueDetail />} />
                <Route path="/profile" element={<UserProfile />} />
            </Route>

            <Route path="/dashboard" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default Routing;
