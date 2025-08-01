'use client';

import React, { useState, type FormEvent, type JSX } from 'react';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();

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
                
                // Store token for future requests (client-side only)
                if (typeof window !== 'undefined') {
                    localStorage.setItem('access_token', data.access_token);
                    localStorage.setItem('user_id', data.user_id);
                }
                
                console.log("Login Successful:", data);
                
                // Redirect to dashboard or home page
                router.push('/dashboard');
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
        <div 
            className={`
            rounded-[20px]
            bg-linear-to-t from-[#015a70] to-[#53003f]
            h-[500px]
            w-[400px]
        `}>
            <h2 className={`
                text-4xl
                p-[30px]
                mt-[40px]
            `}> Sign In</h2>

            <div className="mb-[100px]"></div> 

            <form onSubmit={handleSubmit}>
                <div className="grid pl-6 pr-6 mb-3">
                    <label htmlFor="email" className={`
                        block
                        text-left
                        mb-2
                    `}>Email:</label>
                    <input
                        className={`
                            rounded-[5px]
                            outline-1
                            pl-[10px]
                            outline-[#000000]
                            bg-[#c7c7c7]
                            text-[#000000]
                            hover:outline-3
                        `}
                        type="username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        disabled={isLoading} 
                    />
                </div>
                
                <div className="grid pl-6 pr-6">
                    <label htmlFor="password" className={`
                        block
                        text-left
                        mb-2
                    `}>Password:</label>
                    <input
                        className={`
                            rounded-[5px]
                            outline-1
                            pl-[10px]
                            outline-[#000000]
                            bg-[#c7c7c7]
                            text-[#000000]
                            hover:outline-3
                        `}
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading} 
                    />
                </div>

                <div className="grid pl-6 pr-6 mt-4 pt-[80px]">
                    <button type="submit" disabled={isLoading} className={`
                            rounded-[5px]
                            outline-1
                            p-2
                            hover:outline-5
                        `}>
                        {isLoading ? 'Logging In...' : 'Login'}
                    </button>
                </div>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default LoginForm