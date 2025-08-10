'use client';

import React, { useState, type FormEvent} from 'react';
import { AuthErrorMessage, EmailInput } from '@/components/shared/auth';

export default function PasswordResetForm() {
    const [email, setEmail] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleResetSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setMessage("You will receive a password reset link in your inbox");
    }

    return (
        <div 
            className={`
                content-center
                rounded-[20px]
                bg-[#ffffff1a]
                h-[320px]
                w-[400px]
            `}>
            <AuthErrorMessage message={message}/>

            <h2 className={`
                text-4xl
                p-[30px]
                mt-[40px]
            `}>Reset Password</h2>

            <div></div> 
            <form onSubmit={handleResetSubmit} className="grid pl-6 pr-6 mb-3">
                <EmailInput
                    email={email}
                    setEmail={setEmail}
                    isLoading={isLoading}
                />

                <button type="submit" disabled={isLoading} className={`
                        rounded-[5px]
                        outline-1
                        p-2
                        hover:outline-5
                        grid pl-6 pr-6 mt-10 
                    `}>
                    {isLoading ? 'Sending Reset Link...' : 'Reset Password'}
                </button>
            </form>

        </div>
    )
};