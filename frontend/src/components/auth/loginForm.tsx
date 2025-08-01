'use client';

import React, { useState, type FormEvent, type JSX } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/api/login';

// TODO: account creation form 
// TODO: password reset form
// TODO: correct api endpoint

function LoginForm() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();


    const handleLoginSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const result = await login(
            username,
            password,
            router,
            setIsLoading,
            setMessage
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div 
                className={`
                    content-center
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
                {/* insert google sign in here */}

                <form onSubmit={handleLoginSubmit}>
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
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                                pl-[12px]
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

                    <div className="grid pl-6 pr-6 mt-3 pt-[40px]">
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
        </div>
    );
};

export default LoginForm