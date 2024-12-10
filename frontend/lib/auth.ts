// lib/auth.ts
import axios from "axios";
import { config } from "./config";  // Import the config

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

// Function to login a user
export const login = async (data: LoginData) => {
  try {
    const response = await axios.post(`${config.API_BASE_URL}/api/v1/auth/login`, data);
    return response.data; // Return the response data (e.g., user info or token)
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

// Function to sign up a user
export const signup = async (data: SignupData) => {
  try {
    const response = await axios.post(`${config.API_BASE_URL}/api/v1/auth/signup`, data);
    return response.data; // Return the response data (e.g., success message)
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Signup failed");
  }
};
