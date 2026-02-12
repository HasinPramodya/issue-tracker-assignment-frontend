import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import type { Issue } from '../../types';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Edit, Trash2, Save, X } from 'lucide-react';

const IssueDetail: React.FC = () => {
    const { title } = useParams<{ title: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [issue, setIssue] = useState<Issue | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        description: '',
        status: 'Open',
        priority: 'Low'
    });

    useEffect(() => {
        const fetchIssue = async () => {
            if (!title) return;
            try {

                const response = await api.get(`/issue/${title}`);
                if (response.data && response.data.issue) {
                    const fetchedIssue = response.data.issue;
                    setIssue(fetchedIssue);
                    setFormData({
                        description: fetchedIssue.description,
                        status: fetchedIssue.status,
                        priority: fetchedIssue.priority
                    });
                }
            } catch (err: any) {
                console.error("Fetch Issue Error:", err);
                setError("Issue not found or access denied.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchIssue();
    }, [title]);

    const handleUpdate = async () => {
        if (!issue) return;
        try {

            await api.put(`/issue/${issue.title}`, formData);

            setIssue({ ...issue, ...formData } as Issue);
            setIsEditing(false);
        } catch (err: any) {
            console.error("Update Error:", err);
            alert("Failed to update issue.");
        }
    };

    const handleDelete = async () => {
        if (!issue || !window.confirm("Are you sure you want to delete this issue?")) return;

        if (user?.role !== 'admin') {
            alert("Only admins can delete issues.");
            return;
        }

        try {
            await api.delete(`/issue/${issue.title}`);
            navigate('/issues');
        } catch (err: any) {
            console.error("Delete Error:", err);
            alert("Failed to delete issue.");
        }
    };

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-600">{error}</div>;
    if (!issue) return <div className="p-8">Issue not found.</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate('/issues')}
                        className="mr-4 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 truncate max-w-lg">{issue.title}</h1>
                </div>
                <div className="flex space-x-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleUpdate}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </button>
                            {user?.role === 'admin' && (
                                <button
                                    onClick={handleDelete}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Issue Details</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Created on {new Date(issue.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Assignee</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {typeof issue.assignee === 'object' ? issue.assignee.name : issue.assignee}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {isEditing ? (
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        <option value="Open">Open</option>
                                        <option value="In-Progress">In-Progress</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                ) : (
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${issue.status === 'Open' ? 'bg-green-100 text-green-800' :
                                            issue.status === 'In-Progress' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-blue-100 text-blue-800'}`}>
                                        {issue.status}
                                    </span>
                                )}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Priority</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {isEditing ? (
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                ) : (
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${issue.priority === 'High' ? 'bg-red-100 text-red-800' :
                                            issue.priority === 'Medium' ? 'bg-orange-100 text-orange-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                        {issue.priority}
                                    </span>
                                )}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Description</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {isEditing ? (
                                    <textarea
                                        rows={4}
                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                ) : (
                                    <p className="whitespace-pre-wrap">{issue.description}</p>
                                )}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default IssueDetail;
