import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', () => {
  const items = ref([]);

  function addToCart(item) {
    items.value.push(item);
  }

  function removeFromCart(index) {
    items.value.splice(index, 1);
  }

  const totalItems = computed(() => {
    return items.value.length;
  });

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + item.subtotal, 0);
  });

  function clearCart() {
    items.value = [];
  }

  return {
    items,
    addToCart,
    removeFromCart,
    totalItems,
    totalPrice,
    clearCart,
  };
});