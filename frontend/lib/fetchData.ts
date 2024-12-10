// lib/fetchData.ts

import { config } from './config';

// Handle fetching data from the API from a given endpoint

export const fetchData = async <T>(endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any): Promise<T> => {
  try {
    const response = await fetch(`${config.API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Add authorization later
      },
      body: method === 'POST' ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Error fetching data from ${endpoint}: ${response.statusText}`);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error(`Failed to fetch data from ${endpoint}`);
  }
};
