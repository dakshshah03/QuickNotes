import React, { useState, type FormEvent, type JSX } from 'react';

interface LoginErrorResponse {
  message: string; 
  statusCode?: number; 
}

interface LoginSuccessResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
}

// TODO: account creation form 
// TODO: password reset form
// TODO: correct api endpoint

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
            const formData = new FormData();
            formData.append('username', userName);
            formData.append('password', password);

            const response = await fetch('http://127.0.0.1:8000/auth/token', { 
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data: LoginSuccessResponse = await response.json();
                setMessage("Login Success for " + data.email);
                // Store token for future requests
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('user_id', data.user_id);
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
};

export default LoginForm