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
        const responseData = error.response?.data;
        const status = error.response?.status;

        // Prefer common error fields in server responses: message, error, or an errors array
        const message =
            responseData?.message ||
            responseData?.error ||
            (Array.isArray(responseData?.errors) && responseData.errors[0]?.message) ||
            error.message ||
            "An unexpected error occurred";

        // Optional: add global error logging or toast notifications here
        // e.g. console.debug('API error:', { status, data: responseData });

        // Construct a custom error with richer debug info
        const customError = new Error(message);
        (customError as any).status = status;
        (customError as any).data = responseData;
        (customError as any).original = error; // preserve original axios error

        return Promise.reject(customError);
    }
);

export default api;
