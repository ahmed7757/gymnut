// services/authService.ts
import axios from "axios";

export const authService = {
  async register(userData: any) {
    const response = await axios.post("/api/auth/register", userData);
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await axios.post("/api/auth/forgot-password", { email });
    return response.data;
  },

  async resetPassword(token: string, newPassword: string) {
    const response = await axios.post("/api/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  },
};
