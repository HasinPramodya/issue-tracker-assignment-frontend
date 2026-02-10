import apiClient from "./api";

const setAuthToken = (token: string) => {
    if (token) {
        // Backend expects: Authorization: Bearer <token>
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        // Keep x-auth-token just in case user specifically needs it, but Bearer is primary
        // apiClient.defaults.headers.common["x-auth-token"] = token; 
    } else {
        delete apiClient.defaults.headers.common["Authorization"];
    }
};

export default setAuthToken;