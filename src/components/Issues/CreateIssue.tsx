import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../context/AuthContext';
import type { User } from '../../types';
import { ArrowLeft } from 'lucide-react';

const CreateIssue: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/user');
                console.log('Fetched users:', res.data); // Log for debugging
                if (Array.isArray(res.data)) {
                    setUsers(res.data);
                } else if (res.data.users && Array.isArray(res.data.users)) {
                    setUsers(res.data.users);
                } else {
                    console.error('Unexpected response format:', res.data);
                    setError('Failed to load users: Unexpected response format');
                }
            } catch (err) {
                console.error('Failed to fetch users', err);
                // Optional: Try fallback endpoint if 404
            }
        };
        fetchUsers();
    }, []);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'Open',
        priority: 'Low',
        assignee: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError('You must be logged in to create an issue.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {


            const payload: any = {
                title: formData.title,
                description: formData.description,
                status: formData.status,
                priority: formData.priority
            };

            if (formData.assignee) {
                payload.assignee = formData.assignee;
            }

            await api.post('/issue', payload);
            navigate('/issues');
        } catch (err: any) {
            console.error("Create Issue Error:", err);
            if (err.response) {
                console.error("Error Response Data:", err.response.data);
                console.error("Error Response Status:", err.response.status);
            }
            setError(err.response?.data?.message || err.message || 'Failed to create issue.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center">
                <button
                    onClick={() => navigate('/issues')}
                    className="mr-4 text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Create New Issue</h1>
            </div>

            <div className="bg-white shadow sm:rounded-lg p-6">
                {error && (
                    <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            rows={4}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                name="status"
                                id="status"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Open">Open</option>
                                <option value="In-Progress">In-Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                                Priority
                            </label>
                            <select
                                name="priority"
                                id="priority"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">
                            Assignee
                        </label>
                        <select
                            name="assignee"
                            id="assignee"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.assignee}
                            onChange={handleChange}
                        >
                            <option value="">Select Assignee</option>
                            {users.map((u) => (
                                <option key={u._id} value={u.name}>
                                    {u.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/issues')}
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isLoading ? 'Creating...' : 'Create Issue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateIssue;
