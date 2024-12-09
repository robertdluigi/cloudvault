// components/UserForm.tsx
'use client';

import { useState } from 'react';

interface UserFormProps {
  action: 'login' | 'signup';
}

const UserForm = ({ action }: UserFormProps) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { username, password };

    const response = await fetch(`http://localhost:8080/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log(result);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="password" className="block">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
      >
        {action === 'signup' ? 'Sign Up' : 'Log In'}
      </button>
    </form>
  );
};

export default UserForm;
