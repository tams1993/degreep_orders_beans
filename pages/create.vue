<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Create Coffee Order</h1>
      
      <div class="grid grid-cols-2 gap-4">
        <!-- Customer Selection -->
        <div class="form-control">
          <label class="label">Customer</label>
          <select v-model="selectedCustomer" class="select select-bordered">
            <option v-for="customer in customers" :key="customer.id" :value="customer.id">
              {{ customer.name }}
            </option>
          </select>
        </div>
  
        <!-- Roast Beans Selection -->
        <div class="form-control">
          <label class="label">Roast Beans</label>
          <select v-model="selectedRoastBeans" class="select select-bordered">
            <option v-for="bean in roastBeans" :key="bean.id" :value="bean.id">
              {{ bean.name }} - ${{ bean.price_per_kg }}/kg
            </option>
          </select>
        </div>
  
        <!-- Quantity Input -->
        <div class="form-control">
          <label class="label">Quantity (kg)</label>
          <input 
            type="number" 
            v-model.number="quantity" 
            class="input input-bordered" 
            min="0.1" 
            step="0.1"
          />
        </div>
  
        <!-- Order Summary -->
        <div class="card bg-base-200">
          <div class="card-body">
            <h2 class="card-title">Order Summary</h2>
            <p>Total Price: ${{ totalPrice }}</p>
            <p v-if="appliedPromotion">
              Promotion: {{ appliedPromotion.name }}
              Discount: {{ appliedPromotion.discount_percentage }}%
            </p>
            <p>Final Price: ${{ finalPrice }}</p>
            <button 
              @click="createOrder" 
              class="btn btn-primary"
              :disabled="!canCreateOrder"
            >
              Create Order
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const supabase = useSupabase()
  
  const customers = ref([])
  const roastBeans = ref([])
  const promotions = ref([])
  
  const selectedCustomer = ref(null)
  const selectedRoastBeans = ref(null)
  const quantity = ref(0)
  
  // Fetch initial data
  const { data: customerData } = await supabase.from('customers').select('*')
  customers.value = customerData
  
  const { data: beansData } = await supabase.from('roast_beans').select('*')
  roastBeans.value = beansData
  
  const { data: promoData } = await supabase.from('promotions').select('*')
  promotions.value = promoData
  
  const totalPrice = computed(() => {
    const bean = roastBeans.value.find(b => b.id === selectedRoastBeans.value)
    return bean ? (bean.price_per_kg * quantity.value).toFixed(2) : 0
  })
  
  const appliedPromotion = computed(() => {
    return promotions.value.find(p => 
      quantity.value >= p.min_purchase_amount
    )
  })
  
  const finalPrice = computed(() => {
    const total = parseFloat(totalPrice.value)
    const promo = appliedPromotion.value
    return promo 
      ? (total * (1 - promo.discount_percentage / 100)).toFixed(2) 
      : total
  })
  
  const canCreateOrder = computed(() => 
    selectedCustomer.value && 
    selectedRoastBeans.value && 
    quantity.value > 0
  )
  
  const createOrder = async () => {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_id: selectedCustomer.value,
        total_amount: totalPrice.value,
        discount_amount: appliedPromotion.value 
          ? (totalPrice.value * (appliedPromotion.value.discount_percentage / 100)) 
          : 0,
        final_amount: finalPrice.value,
        promotion_id: appliedPromotion.value?.id
      })
      .select()
  
    if (data) {
      await supabase.from('order_items').insert({
        order_id: data[0].id,
        roast_beans_id: selectedRoastBeans.value,
        quantity: quantity.value,
        item_price: roastBeans.value.find(b => b.id === selectedRoastBeans.value).price_per_kg,
        subtotal: totalPrice.value
      })
    }
  }
  </script>