// composables/useAuth.ts

export const useAuth = () => {
    const { $supabaseClient } = useNuxtApp()
    const supabase = $supabaseClient;

    const loading = ref(false);
    const error = ref<string | null>(null);
    const user = useSupabaseUser()

    const signIn = async (email: string, password: string) => {
        try {
            loading.value = true;
            error.value = null;

            const { data, error: err } = await supabase.auth.signInWithPassword(
                {
                    email,
                    password,
                },
            );

            if (err) throw err;

            return data;
        } catch (err: any) {
            error.value = err.message;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const signUp = async (email: string, password: string) => {
        try {
            loading.value = true;
            error.value = null;

            const { data, error: err } = await supabase.auth.signUp({
                email,
                password,
            });

            if (err) throw err;

            return data;
        } catch (err: any) {
            error.value = err.message;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const signOut = async () => {
        try {
            loading.value = true;
            error.value = null;

            const { error: err } = await supabase.auth.signOut();
            if (err) throw err;
        } catch (err: any) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    };

    const resetPassword = async (email: string) => {
        try {
            loading.value = true;
            error.value = null;

            const { error: err } = await supabase.auth.resetPasswordForEmail(
                email,
                {
                    redirectTo: `${window.location.origin}/reset-password`,
                },
            );

            if (err) throw err;
        } catch (err: any) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    };

    return {
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        resetPassword,
    };
};
