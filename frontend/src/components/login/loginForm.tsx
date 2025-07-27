import React, { useState, type FormEvent, type JSX } from 'react';

interface LoginErrorResponse {
  message: string; // The error message from your API
  statusCode?: number; // Optional HTTP status code from your API
}

interface LoginSuccessResponse {
  user: {
    id: string;
    email: string;
    username: string;
    name: string;
  };
  token: string; 
  message?: string; 
}

// TODO: account creation form 
// TODO: password reset form

function LoginForm(): JSX.Element {
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setMessage('');

        setIsLoading(true);

        try {
            const response = await fetch('/api/login', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName, password }),
            });

            if (response.ok) {
                const data: LoginSuccessResponse = await response.json();
                setMessage("Login Success for " + data.user.username);
                console.log("Login Successful:", data);
            } else {
                const errorData: LoginErrorResponse = await response.json();
                setMessage("Login failed: " + (errorData.message || "Invalid credentials"));
                console.error("Login error:", errorData);
            }
        } catch(error) {
            if (error instanceof Error) {
                setMessage("An error occurred during login: " + error.message);
            } else {
                setMessage("An unknown error occurred during login. Please try again.");
            }
            console.error("Network error during login:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2> Login </h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="username"
                        id="username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        disabled={isLoading} 
                    />
                </div>
                
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading} 
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging In...' : 'Login'}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default LoginForm