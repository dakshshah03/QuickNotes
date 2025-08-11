import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { setAuthToken } from '@/utils/auth';

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
        
        const response = await fetch('http://localhost:8000/user/create', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            }),
        });

        if (!response.ok) {
            const errorData: AccountCreateErrorResponse = await response.json();
            setMessage("Account Creation failed: " + (errorData.message || 'Unknown error'));
            console.error("Create user error:", errorData);
            return;
        } 

        const data: AccountCreateSuccessResponse = await response.json();

        setAuthToken(data.access_token, data.user_id);
        
        // Check for stored redirect destination
        const redirectPath = sessionStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
            sessionStorage.removeItem('redirectAfterLogin');
            router.push(redirectPath);
        } else {
            router.push('/dashboard');
        }

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