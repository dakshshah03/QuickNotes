'use client';

import React, { useState, type FormEvent} from 'react';
import { AuthErrorMessage, PasswordInput } from '@/components/shared/auth';

export default function PasswordResetForm() {
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>(''); 

    const handleSetNewPassword = async (event: FormEvent) => {
        
    }

    return (
        <div 
            className={`
                content-center
                rounded-[20px]
                bg-[#ffffff1a]
                h-[460px]
                w-[400px]
            `}>
            <AuthErrorMessage message={message}/>

            <h2 className={`
                text-4xl
                p-[30px]
                mt-[40px]
            `}>Set New Password</h2>

            <div className="pb-[60px]"></div> 
            <form onSubmit={handleSetNewPassword} className="grid pl-6 pr-6 mb-3">
                <PasswordInput
                    password={password}
                    setPassword={setPassword}
                    isLoading={isLoading}
                    text="Password"
                />

                <div className="pt-5"/>

                <PasswordInput
                    password={confirmPassword}
                    setPassword={setConfirmPassword}
                    isLoading={isLoading}
                    text="Confirm Password"
                    hidePassword={false}
                    disablePaste={true}
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