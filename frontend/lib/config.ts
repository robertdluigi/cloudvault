// lib/config.ts

// Configuration object to store the API base URL
export const config = {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080', // Default to localhost in dev
  };
  