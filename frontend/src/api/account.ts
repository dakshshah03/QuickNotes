import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface AccountCreateErrorResponse {
  message: string; 
  statusCode?: number; 
};

interface AccountCreateSuccessResponse {
  access_token: string;
  token_type: string;
  user_id: string;
}

export const createUser = async (
    name: string,
    email: string,
    password: string,
    router: AppRouterInstance,
    setIsLoading: (isLoading: boolean) => void,
    setMessage: (message: string) => void
) => {
    try {
        setIsLoading(true);
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);

        const response = await fetch('http://localhost:8000/auth/create', { 
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData: AccountCreateErrorResponse = await response.json();
            setMessage("Account Creation failed: " + (errorData.message));
            console.error("Login error:", errorData);
        } 

        const data: AccountCreateSuccessResponse = await response.json();

        if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user_id', data.user_id);
        }
        router.push('/dashboard');

    } catch (error) {
        setMessage("An unexpected error occurred. Please try again later.");
        console.error("Unexpected error:", error);
    } finally {
        setIsLoading(false);
    }
}

export const beginReset = async () => {
// api will send password reset email to user
}

export const resetPassword = async () => {
// sets new password (user id is JWT encoded in the URL)
}