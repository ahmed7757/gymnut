import axios from "axios";

// Create a singleton Axios instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api` : "/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // For handling cookies/sessions
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Extract error message from backend standardized response
        const message = error.response?.data?.message || "An unexpected error occurred";
        const status = error.response?.status;

        // You could add global error logging or toast notifications here
        // e.g. toast.error(message);

        // Construct a custom error object or pass through
        const customError = new Error(message);
        (customError as any).status = status;
        (customError as any).data = error.response?.data;

        return Promise.reject(customError);
    }
);

export default api;
