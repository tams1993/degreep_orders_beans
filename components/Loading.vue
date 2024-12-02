<template>
    <div class="flex justify-center " v-if="loading">
        <div>
            <Vue3Lottie :animationData="coffee" :height="400" :width="400" />
        </div>
    </div>
</template>

<script setup >
import coffee from '~/assets/lottie/coffee-loading.json'

const props = defineProps({
    loading: {
        type: Boolean,
        required: true
    }
});


</script>

<style scoped>
/* Add your custom styles here */
</style>