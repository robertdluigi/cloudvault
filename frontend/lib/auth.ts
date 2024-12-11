import axios from "axios";
import { config } from "./config"; // Import the config

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}

// Enable cookies for axios requests
axios.defaults.withCredentials = true;

// Function to login a user
export const login = async (data: LoginData) => {
  try {
    const response = await axios.post(`${config.API_BASE_URL}/api/v1/auth/login`, data);

    if (response.data && response.data.token) {
      // Store the token in localStorage
      localStorage.setItem("authToken", response.data.token);

      return {
        username: response.data.username,
        message: response.data.message,
        token: response.data.token,
      }; // Return login success message and token
    } else {
      throw new Error("Unexpected login response");
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

// Function to sign up a user
export const signup = async (data: SignupData) => {
  try {
    const response = await axios.post(`${config.API_BASE_URL}/api/v1/auth/signup`, data);
    return response.data; // Return success message or user info
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Signup failed");
  }
};

// Function to validate the user's session
export const validateAuth = async () => {
  try {
    // Check session validity from the backend
    const response = await axios.get(`${config.API_BASE_URL}/api/v1/auth/validate`);
    return response.data; // Return user info or session validity details
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Session invalid. Please log in.");
  }
};

// Function to logout the user
export const logout = async () => {
  try {
    // Make a request to log out and clear the session
    await axios.post(`${config.API_BASE_URL}/api/v1/auth/logout`);

    // Clear the local token after logout
    localStorage.removeItem("authToken");
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Logout failed");
  }
};