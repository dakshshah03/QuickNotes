'use client';
import React, {useState} from 'react';

export const AuthErrorMessage = ({ message }: { message: string }) => {
    return (
        <div>
            {message && (
                <div 
                    className="
                        absolute
                        top-0
                        left-0
                        w-full
                        p-[15px]
                        bg-red-500
                        text-white
                        text-center
                        rounded-t-[20px]
                    ">
                    {message}
                </div>
            )}
        </div>
    );
};

export const EmailInput = ({
    email,
    setEmail,
    isLoading,
}: {
    email: string;
    setEmail: (email: string) => void;
    isLoading: boolean;
}) => {
    return (
        <div className="w-full">
            <label
                htmlFor="email"
                className={`
                    block
                    text-left
                    mb-2
                `}
            >
                Email:
            </label>
            <input
                className={`
                    w-full
                    rounded-[5px]
                    outline-1
                    pl-[10px]
                    outline-[#000000]
                    bg-[#c7c7c7]
                    text-[#000000]
                    hover:outline-3
                `}
                type="email"
                value={email}
                placeholder="daksh@email.com"
                onChange={(e) => setEmail(e.target.value)}
                onPaste={(e) => e.preventDefault()}
                required
                disabled={isLoading}
            />
        </div>
    );
};

export const PasswordInput = ({
    password,
    setPassword,
    isLoading,
    text,
    hidePassword = true,
    disablePaste = false
}: {
    password: string;
    setPassword: (password: string) => void;
    isLoading: boolean;
    text: string;
    hidePassword?: boolean;
    disablePaste?: boolean;
}) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <div className="w-full relative">
            <label
                htmlFor="password"
                className={`
                    block
                    text-left
                    mb-2
                `}
            >
                {text}:
            </label>
            <div className="relative">
                <input
                    className={`
                        w-full
                        rounded-[5px]
                        outline-1
                        pl-[10px]
                        pr-[40px]
                        outline-[#000000]
                        bg-[#c7c7c7]
                        text-[#000000]
                        hover:outline-3
                    `}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                    onPaste={disablePaste ? (e) => e.preventDefault() : undefined} 
                    required
                    disabled={isLoading}
                />
                {hidePassword ? (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`
                            absolute
                            right-[10px]
                            top-[50%]
                            transform
                            -translate-y-[50%]
                            text-[#000000]
                            hover:text-[#0000007e]
                        `}
                        disabled={isLoading}
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                ) : null}
            </div>
        </div>
    );
};

export const NameInput = ({
    name,
    setName,
    isLoading
} : {
    name: string;
    setName: (email: string) => void;
    isLoading: boolean;
}) => {
    return (
        <div className="w-full">
            <label
                htmlFor="email"
                className={`
                    block
                    text-left
                    mb-2
                `}
            >
                Name:
            </label>
            <input
                className={`
                    w-full
                    rounded-[5px]
                    outline-1
                    pl-[10px]
                    outline-[#000000]
                    bg-[#c7c7c7]
                    text-[#000000]
                    hover:outline-3
                `}
                type="name"
                value={name}
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
            />
        </div>
    );
}