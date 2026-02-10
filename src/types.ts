export interface User {
    _id: string; // MongoDB ID
    name: string;
    email: string;
    role: 'user' | 'admin';
}

export interface Issue {
    _id: string;
    title: string;
    description: string;
    status: 'Open' | 'In-Progress' | 'Resolved';
    priority: 'High' | 'Medium' | 'Low';
    assignee?: User | string; // Can be populated user object or ID string
    createdAt: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}
