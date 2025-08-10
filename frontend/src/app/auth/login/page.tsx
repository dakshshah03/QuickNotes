'use client';

import React, { useState, type FormEvent} from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/api/login';
import { AuthErrorMessage, EmailInput, PasswordInput } from '@/components/shared/auth';

// TODO: account creation form 
// TODO: password reset form
// TODO: correct api endpoint

function LoginForm() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();


    const handleLoginSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const result = await login(
            email,
            password,
            router,
            setIsLoading,
            setMessage
        );
        // TODO: do something with the result
    }

    return (
        <div 
            className={`
                content-center
                rounded-[20px]
                bg-[#ffffff1a]
                h-[500px]
                w-[400px]
            `}>
            <AuthErrorMessage message={message}/>

            <h2 className={`
                text-4xl
                p-[30px]
                mt-[40px]
            `}> Sign In</h2>

            <div className="mb-[100px]"></div> 
            {/* insert google sign in here */}

            <form onSubmit={handleLoginSubmit} className="grid pl-6 pr-6 mb-3">
                <EmailInput
                    email={email}
                    setEmail={setEmail}
                    isLoading={isLoading}
                />

                <div className="pt-5"/>

                <PasswordInput
                    password={password}
                    setPassword={setPassword}
                    isLoading={isLoading}
                    text="Password"/>
                    
                <div className="text-left mt-2">
                    <a 
                        href="/auth/reset" 
                        className="text-[#7fcefc] hover:underline"
                    >
                        Reset Password
                    </a>
                </div>

                <button type="submit" disabled={isLoading} className={`
                        rounded-[5px]
                        outline-1
                        p-2
                        hover:outline-5
                        grid pl-6 pr-6 mt-10 
                    `}>
                    {isLoading ? 'Logging In...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default LoginForm