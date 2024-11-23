import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/supabaseClient';
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true);
            
            // Get the current URL origin for the redirect
            const redirectTo = `${window.location.origin}`;
            
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                    redirectTo: redirectTo
                }
            });

            if (error) {
                throw error;
            }

            // If we have a URL to redirect to, use it
            if (data?.url) {
                window.location.href = data.url;
            }

        } catch (error) {
            console.error('Error signing in with Google:', error);
            toast({
                title: "Authentication Error",
                description: "Failed to sign in with Google. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-100 dark:bg-neutral-900">
            <div className="w-full max-w-sm space-y-6 rounded-lg bg-white p-8 shadow-lg dark:bg-neutral-800">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                        Welcome Back
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Sign in to your account to continue
                    </p>
                </div>

                <div className="space-y-4">
                    <Button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-200"
                    >
                        {isLoading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-800 border-t-transparent" />
                        ) : (
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                        )}
                        {isLoading ? "Signing in..." : "Continue with Google"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Login;