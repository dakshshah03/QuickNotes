'use client';

import React, { useEffect, useState, type FormEvent} from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/api/login';

import { AuthErrorMessage, EmailInput, PasswordInput, NameInput } from '@/components/shared/auth';


export default function AccountCreate() {
    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>(''); // Added state for confirm password
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();

    const handleAccountCreate = async (event: FormEvent) => {
        event.preventDefault();
        if(password != confirmPassword) {
            setMessage("Error: Passwords don't match");
            return;
        }
    };

    useEffect(() => {
    }, [])

    return (
       <div 
            className={`
                content-center
                rounded-[20px]
                bg-[#ffffff1a]
                h-[600px]
                w-[400px]
            `}>
            <AuthErrorMessage message={message}/>
            
            <h2 className={`
                text-4xl
                p-[30px]
                mt-[40px]
            `}> Create Account</h2>
            <div className="mb-[50px]"></div> 

            <form onSubmit={handleAccountCreate} className="grid pl-6 pr-6 mb-3">
                <NameInput 
                    name={name}
                    setName={setName}
                    isLoading={isLoading}
                />
                                
                <div className="pt-5"/>

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
                    {isLoading ? 'Logging In...' : 'Login'}
                </button>
            </form>
        </div>
    )
}