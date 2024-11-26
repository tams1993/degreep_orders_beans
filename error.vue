<template>
    <div class="flex items-center justify-center h-screen text-center">
      <div>
        <h1 class="text-5xl font-bold">Oops!</h1>
        <Vue3Lottie :animationData="catError" :height="400" :width="400" />
        <p class="mt-2 text-xl">{{ error?.message }}</p>
        <button @click="handleError" class="btn btn-primary mt-6">
          Go Home
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import catError from '~/assets/lottie/cat-error.json'
  const error = useError();
  
  // Function to navigate home or reload the page
  const handleError = () => {
    if (error.statusCode === 404) {
      return navigateTo('/');
    }
    // Optionally, you can reload the page for other errors
    window.location.reload();
  };
  </script>
  
  <style scoped>
  /* Add your custom styles here */
  </style>