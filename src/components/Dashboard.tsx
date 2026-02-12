import { useEffect, useState } from 'react';
import api from '../utils/api';
import type { Issue } from '../types';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        open: 0,
        inProgress: 0,
        resolved: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {

                const issuesRes = await api.get('/issue');
                if (issuesRes.data && Array.isArray(issuesRes.data.issues)) {
                    setIssues(issuesRes.data.issues);
                } else if (Array.isArray(issuesRes.data)) {
                    setIssues(issuesRes.data);
                }


                const statsRes = await api.get('/issue/counts');
                console.log('Stats Response:', statsRes);
                if (statsRes.data) {
                    console.log('Setting Stats:', statsRes.data);
                    setStats({
                        total: statsRes.data.total,
                        open: statsRes.data.open,
                        inProgress: statsRes.data.InProgress,
                        resolved: statsRes.data.resolved
                    });
                } else {
                    console.warn('Stats response data is empty');
                }

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) return <div className="p-8">Loading dashboard...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <Link to="/issues" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                    View All Issues
                </Link>
            </div>


            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Issues</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.total}</dd>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Open Issues</dt>
                    <dd className="mt-1 text-3xl font-semibold text-green-600">{stats.open}</dd>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">In-Progress</dt>
                    <dd className="mt-1 text-3xl font-semibold text-yellow-600">{stats.inProgress}</dd>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Resolved Issues</dt>
                    <dd className="mt-1 text-3xl font-semibold text-blue-600">{stats.resolved}</dd>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
                </div>
                <ul className="divide-y divide-gray-200">
                    {issues.slice(0, 5).map((issue) => (
                        <li key={issue._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-blue-600 truncate">{issue.title}</span>
                                    <span className="text-xs text-gray-500">{issue.description.substring(0, 50)}...</span>
                                </div>
                                <div className="ml-2 flex-shrink-0 flex">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${issue.status === 'Open' ? 'bg-green-100 text-green-800' :
                                            issue.status === 'In-Progress' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-blue-100 text-blue-800'}`}>
                                        {issue.status}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                    {issues.length === 0 && (
                        <li className="px-4 py-4 sm:px-6 text-gray-500 text-sm">
                            No issues found. Create one to get started!
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
