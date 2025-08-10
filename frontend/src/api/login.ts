import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface LoginErrorResponse {
  message: string; 
  statusCode?: number; 
};

interface LoginSuccessResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
};

export const login = async (
    username: string,
    password: string,
    router: AppRouterInstance,
    setIsLoading: (isLoading: boolean) => void,
    setMessage: (message: string) => void
) => {
    try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch('http://localhost:8000/auth/token', { 
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data: LoginSuccessResponse = await response.json();
            // setMessage("Login Success for " + data.email);
            
            if (typeof window !== 'undefined') {
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('user_id', data.user_id);
            }
            
            console.log("Login Successful:", data);
            
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