<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Create Coffee Order</h1>
      
      <div class="grid grid-cols-2 gap-4">
        <!-- Customer Selection -->
        <div class="form-control">
          <label class="label">Customer</label>
          <select v-model="selectedCustomer" class="select select-bordered">
            <option v-for="customer in customers" :key="customer.id" :value="customer.id">
              {{ customer.firstname }} {{ customer.lastname }}
            </option>
          </select>
        </div>
  
        <!-- Roast Beans Selection -->
        <div class="form-control">
          <label class="label">Roast Beans</label>
          <select v-model="selectedRoastBeans" class="select select-bordered">
            <option v-for="bean in roastBeans" :key="bean.id" :value="bean.id">
              {{ bean.name }} - {{ formatLakPrice(bean.price_per_kg) }}/kg
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

          <!-- Shipping Address Selection -->
      <div class="form-control">
        <label class="label">Shipping Address</label>
        <select v-model="selectedShippingAddress" class="select select-bordered" :disabled="!selectedCustomer">
          <option value="">Select shipping address</option>
          <option v-for="address in shippingAddresses" :key="address.id" :value="address.id">
            {{ address.receiver_name }} - {{ address.city }}
          </option>
        </select>
        <!-- Show selected address details -->
        <div v-if="selectedShippingAddress && currentAddress" class="mt-2 text-sm bg-base-200 p-2 rounded-lg">
          <p><span class="font-medium">Receiver:</span> {{ currentAddress.receiver_name }}</p>
          <p><span class="font-medium">Phone:</span> {{ currentAddress.phone }}</p>
          <p><span class="font-medium">Address:</span> {{ currentAddress.branch_details }}</p>
          <p>{{ currentAddress.city }}, {{ currentAddress.province }}, {{ currentAddress.country }}</p>
          <p><span class="font-medium">Shipping:</span> {{ currentAddress.shipping_company }}</p>
        </div>
      </div>
  
        <!-- Order Summary -->
        <div class="card bg-base-200 col-span-2">
          <div class="card-body">
            <h2 class="card-title">Order Summary</h2>
            <p>Total Price: {{ formatLakPrice(totalPrice) }}</p>
            <p v-if="appliedPromotion">
              Promotion: {{ appliedPromotion.name }}
              Discount: {{ appliedPromotion.discount_percentage }}%
            </p>
            <p>Final Price: {{ formatLakPrice(finalPrice) }}</p>
            <button 
              @click="createOrder" 
              class="btn btn-primary"
              :disabled="!canCreateOrder || loading"
            >
            <span class="loading loading-spinner loading-lg text-accent" v-if="loading"></span>
            <span v-if="!loading">
              Create Order
            </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import coffee from '~/assets/lottie/coffee.json'
  const supabase = useSupabase()
  const { formatLakPrice, calculateTotalLakPrice } = useLakPrice()

  const customers = ref([])
  const roastBeans = ref([])
  const promotions = ref([])
  const loading = ref(false)
  
  const selectedCustomer = ref(null)
  const selectedRoastBeans = ref(null)
  const quantity = ref(1)
  const shippingAddresses = ref([])
  const selectedShippingAddress = ref('')
  
  // Fetch initial data
  const { data: customerData } = await supabase.from('customers').select('*')
  customers.value = customerData
  
  const { data: beansData } = await supabase.from('roast_beans').select('*')
  roastBeans.value = beansData
  
  const { data: promoData } = await supabase.from('promotions').select('*')
  promotions.value = promoData

  const currentAddress = computed(() => {
  return shippingAddresses.value.find(addr => addr.id === selectedShippingAddress.value)
  })
  
  const totalPrice = computed(() => {
    const bean = roastBeans.value?.find(b => b.id === selectedRoastBeans.value)
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

  // Watch for customer changes
  watch(selectedCustomer, async (newVal) => {
    if (newVal) {
      await loadShippingAddresses()
    }
  })
  
  const createOrder = async () => {
    loading.value = true
  try {
    // Insert the order into the 'orders_beans' table
    const { data: ordersData, error: ordersError } = await supabase.from('orders_beans').insert([
      {
        customer_id: selectedCustomer.value,
        total_amount: totalPrice.value,
        discount_amount: appliedPromotion.value
          ? (totalPrice.value * (appliedPromotion.value.discount_percentage / 100))
          : 0,
        final_amount: finalPrice.value,
        promotion_id: appliedPromotion.value?.id,
        shipping_address_id: selectedShippingAddress.value,

      }
    ]).select()

    if (ordersError) {
      throw new Error(`Failed to create order: ${ordersError.message}`);
    }

    const orderId = ordersData[0].id

    // Insert the order item into the 'order_items' table
    const { data: orderItemsData, error: orderItemsError } = await supabase.from('order_items').insert([
      {
        order_id: orderId,
        roast_beans_id: selectedRoastBeans.value,
        quantity: quantity.value,
        item_price: roastBeans.value.find(b => b.id === selectedRoastBeans.value).price_per_kg,
        subtotal: totalPrice.value
      }
    ])

    if (orderItemsError) {
      throw new Error(`Failed to create order item: ${orderItemsError.message}`);
    }

    // If both operations are successful, show a success message
    useNuxtApp().$toast.success('Order has been created');
    loading.value = false
  } catch (error) {
    loading.value = false
    console.error(error);
    useNuxtApp().$toast.error(error.message || 'An error occurred while creating the order.');
  }
}

// Methods
async function loadShippingAddresses() {
  if (!selectedCustomer.value) {
    shippingAddresses.value = []
    selectedShippingAddress.value = ''
    return
  }

  try {
    const { data, error } = await supabase
      .from('shipping_information')
      .select('*')
      .eq('customer_id', selectedCustomer.value)
      .order('created_at', { ascending: false })

    if (error) throw error
    shippingAddresses.value = data
    selectedShippingAddress.value = ''
  } catch (err) {
    console.error('Error loading shipping addresses:', err)
    shippingAddresses.value = []
  }
}
  </script>