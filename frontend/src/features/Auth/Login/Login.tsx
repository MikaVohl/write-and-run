import { Button } from '@/components/ui/button';
import { supabase } from '@/supabaseClient';
import { Icons } from '@/components/ui/icons';

function Login() {
    const handleGoogleSignIn = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });

        if (error) {
            console.error('Error signing in with Google:', error.message);
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
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full transition-opacity hover:opacity-90 focus:outline-none"
                    >
                        <img
                            src="/assets/googleIcons/png@4x/light/web_light_sq_ctn@4x.png"
                            alt="Sign in with Google"
                            className="w-full h-auto"
                        />
                    </button>

                    {/* <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t dark:border-neutral-700" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button
                        variant="default"
                        className="w-full"
                        onClick={() => window.location.href = '/auth/email'}
                    >
                        <Icons.mail className="mr-2 h-4 w-4" />
                        Continue with Email
                    </Button> */}

                    {/* <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                        Already have an account?{' '}
                        <a
                            href="/login"
                            className="font-medium text-primary hover:underline"
                        >
                            Log in
                        </a>
                    </p> */}
                </div>
            </div>
        </div>
    );
}

export default Login;