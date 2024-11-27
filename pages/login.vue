<!-- pages/login.vue -->
<template>
    <div class="min-h-screen flex items-center justify-center">
        <div class="max-w-md w-full space-y-8 p-6">
            <h2 class="text-center text-3xl font-bold">Sign in to your account</h2>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div>
                    <label for="email" class="block text-sm font-medium">Email</label>
                    <input id="email" v-model="email" type="email" required
                        class="mt-1 block w-full px-3 py-2 border rounded-md">
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium">Password</label>
                    <input id="password" v-model="password" type="password" required
                        class="mt-1 block w-full px-3 py-2 border rounded-md">
                </div>

                <div v-if="error" class="text-red-500 text-sm">
                    {{ error }}
                </div>

                <button type="submit" :disabled="loading"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {{ loading ? 'Signing in...' : 'Sign in' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ['guest']
})
const { signIn, loading, error } = useAuth()
const email = ref('')
const password = ref('')

async function handleSubmit() {
    const data = await signIn(email.value, password.value)
    const router = useRouter()

    if (data) {
        // Navigate to the current route again
        router.go(0)
    }
}
</script>