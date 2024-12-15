import axios from "axios";
import { config } from "./config"; // Import the config
import { LOGIN_QUERY } from "@/lib/query"; // Import queries

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

// Define types for GraphQL responses
interface LoginResponse {
  auth: {
    login: {
      token: string;
    };
  };
}

interface SignupResponse {
  signup: {
    message: string;
    user: {
      id: string;
      username: string;
      email: string;
    };
  };
}

interface ValidateAuthResponse {
  validateAuth: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface LogoutResponse {
  logout: {
    message: string;
  };
}

const client = axios.create({
  baseURL: `${config.API_BASE_URL}/query`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable cookies for cross-origin requests
});

// Function to login a user
export async function login(data: LoginData): Promise<string> {
  try {
    const response = await axios.post(`${config.API_BASE_URL}/query`, {
      query: LOGIN_QUERY,
      variables: { email: data.email, password: data.password },
    });

    // Check for errors in the response
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    // Extract token from the response
    const token: string = response.data.data.auth.login.token;

    // Store token in localStorage (or sessionStorage)
    localStorage.setItem("authToken", token); // Store token for future requests

    return token;
  } catch (error: any) {
    throw new Error(`Login failed: ${error.message}`);
  }
}

// Function to sign up a user
export const signup = async (data: SignupData) => {
  const SIGNUP_MUTATION = `
    mutation Signup($input: SignupInput!) {
      signup(input: $input) {
        message
        user {
          id
          username
          email
        }
      }
    }
  `;

  try {
    const response = await client.post("", {
      query: SIGNUP_MUTATION,
      variables: {
        input: {
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          email: data.email,
          password: data.password,
        },
      },
    });

    const responseData = response.data as { data: SignupResponse };
    return responseData.data.signup;
  } catch (error: any) {
    throw new Error(error.response?.data?.errors?.[0]?.message || "Signup failed");
  }
};

// Function to validate the user's session
export const validateAuth = async (token: string) => {
  if (!token) {
    throw new Error("No token provided");
  }
  
  const VALIDATE_AUTH_QUERY = `
    query ValidateAuth {
      validateAuth {
        id
        username
        first_name
        last_name
        email
      }
    }
  `;

  try {
    const response = await client.post(
      "",
      {
        query: VALIDATE_AUTH_QUERY,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to Authorization header
        },
      }
    );

    // Ensure response contains the expected data structure
    const responseData = response.data as { data: ValidateAuthResponse };

    // Return the user data if the validation was successful
    if (responseData.data?.validateAuth) {
      return responseData.data.validateAuth;
    } else {
      throw new Error("No user data found in validation response");
    }
  } catch (error: any) {
    // Catch and rethrow any error with a more informative message
    throw new Error(
      error.response?.data?.errors?.[0]?.message || "Session invalid. Please log in."
    );
  }
};

// Function to logout the user
export const logout = async () => {
  const LOGOUT_MUTATION = `
    mutation Logout {
      logout {
        message
      }
    }
  `;

  try {
    const response = await client.post("", {
      query: LOGOUT_MUTATION,
    });

    const responseData = response.data as { data: LogoutResponse };
    localStorage.removeItem("authToken"); // Clear the local token after logout
    return responseData.data.logout.message;
  } catch (error: any) {
    throw new Error(error.response?.data?.errors?.[0]?.message || "Logout failed");
  }
};
