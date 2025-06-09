<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Create Coffee Order</h1>
    Change Quantity to amount. add Size selection and update roast beans selection
    <div class="flex h-full">
      <!-- Form -->
      <div class="grid grid-cols-2 gap-4 w-3/5">
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
          <select v-model="selectedRoastBeans" class="select select-bordered" :disabled="!selectedCustomer">
            <option v-for="bean in roastBeans" :key="bean.id" :value="bean">
              {{ bean.name }} - {{ formatLakPrice(bean.price_per_kg) }}/kg
            </option>
          </select>
        </div>
        <!-- Quantity Input -->
        <div class="form-control">
          <label class="label">Quantity (kg)</label>
          <input type="number" v-model.number="quantity" class="input input-bordered" min="0.1" step="0.1"
            :disabled="!selectedCustomer" />
        </div>
        <!-- Roast level -->
        <div class="form-control">
          <label class="label">Roast Level</label>
          <select v-model="selectedRoastLevel" class="select select-bordered" :disabled="!selectedCustomer">
            <option v-for="level in roastLevelData" :key="level.id" :value="level">
              {{ level.level }}
            </option>
          </select>
        </div>
        <!-- Add to Cart Button -->
        <div class="grid grid-cols-subgrid gap-4 col-span-2 mt-4">
          <button @click="addToCart" class="btn btn-accent col-start-2">
            Add to Cart
          </button>
        </div>
      </div>

      <!-- ORDER SUMMARY -->
      <div class="card bg-base-200 h-full w-2/5 shadow-lg p-4 ml-4 overflow-y-auto absolute top-0 right-0">
        <div class="card-body">
          <!-- Order Summary Header -->
          <div class="flex justify-between items-center mb-4">
            <h2 class="card-title text-2xl font-bold">Order Summary</h2>
            <div class="badge badge-primary badge-lg">{{ cart.length }} Items</div>
          </div>

          <!-- Cart Items Section -->
          <div v-if="cart?.length > 0" class="mb-4">
            <div class="divide-y divide-base-300">
              <div v-for="(item, index) in cart" :key="index" class="flex justify-between items-center py-2">
                <div class="flex items-center space-x-3">
                  <div class="avatar placeholder">
                    <div class="bg-neutral text-neutral-content rounded-full w-12 h-12">
                      <span class="text-xs">{{ item.quantity }}kg</span>
                    </div>
                  </div>
                  <div>
                    <p class="font-semibold">{{ item.roast_bean.name }}</p>
                    <p class="text-sm text-base-content text-opacity-50">
                      Roast Level: {{ item.roast_level.level }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="font-medium">{{ formatLakPrice(item.subtotal) }}</span>
                  <button class="btn btn-error btn-xs btn-circle" @click="removeFromCart(index)">
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Shipping Address Section -->
          <div class="mb-4">
            <div class="form-control">
              <div class="form-control w-full max-w-xs">
                <label class="label">
                  <span class="label-text">Delivery Method</span>
                </label>

                <label class="cursor-pointer label" v-for="delivery in deliveryMethods" :key="delivery.id">
                  <span class="label-text">{{ delivery.delivery_type }}</span>
                  <input type="radio" name="delivery_method" :value="delivery.id" class="radio checked:bg-primary"
                    v-model="selectedDelivery" :disabled="cart.length === 0" />
                </label>


              </div>
              <div v-if="selectedDelivery === 2">
                <label class="label">
                  <span class="label-text font-semibold">Shipping Address</span>
                </label>
                <select v-model="selectedShippingAddress" class="select select-bordered w-full"
                  :disabled="cart.length === 0" v-if="selectedDelivery == 2">
                  <option value="">Select shipping address</option>
                  <option v-for="address in shippingAddresses" :key="address.id" :value="address.id">
                    {{ address.receiver_name }} - {{ address.city }}
                  </option>
                </select>
              </div>


              <!-- Expanded Address Details -->
              <div v-if="selectedShippingAddress && currentAddress" class="mt-2 bg-base-100 p-3 rounded-lg shadow-sm">
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <p class="text-sm text-base-content text-opacity-60">Receiver</p>
                    <p class="font-medium">{{ currentAddress.receiver_name }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-base-content text-opacity-60">Phone</p>
                    <p class="font-medium">{{ currentAddress.phone }}</p>
                  </div>
                  <div class="col-span-2">
                    <p class="text-sm text-base-content text-opacity-60">Address</p>
                    <p>
                      {{ currentAddress.branch_details }},
                      {{ currentAddress.city }},
                      {{ currentAddress.province }},
                      {{ currentAddress.country }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-base-content text-opacity-60">Shipping Company</p>
                    <p class="font-medium">{{ currentAddress.shipping_company }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Price Breakdown -->
          <div class="bg-base-100 p-4 rounded-lg shadow-sm">
            <div class="space-y-2">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span class="font-medium">{{ formatLakPrice(totalSubtotal()) }}</span>
              </div>

              <div v-if="appliedPromotion" class="flex justify-between text-success">
                <span>
                  Promotion: {{ appliedPromotion.name }}
                  <span class="badge badge-success badge-sm">
                    -{{ appliedPromotion.discount_percentage }}%
                  </span>
                </span>
                <span>
                  -{{ formatLakPrice(totalSubtotal() * (appliedPromotion.discount_percentage / 100)) }}
                </span>
              </div>

              <div class="divider my-1"></div>

              <div class="flex justify-between font-bold">
                <span>Total</span>
                <span>{{ formatLakPrice(finalPrice) }}</span>
              </div>
            </div>
          </div>

          <!-- Order Creation Button -->
          <div class="card-actions justify-end mt-4">
            <button @click="createOrder" class="btn btn-primary w-full" :disabled="!canCreateOrder">
              <span v-if="loading" class="loading loading-spinner loading-lg"></span>
              Create Order
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'


const { $supabaseClient } = useNuxtApp()
const supabase = $supabaseClient
const { formatLakPrice, calculateTotalLakPrice } = useLakPrice()

const customers = ref([])
const roastBeans = ref([])
const roastLevel = ref([])
const promotions = ref([])
const deliveryMethods = ref([])
const cart = ref([])

const loading = ref(false)

const selectedCustomer = ref(null)
const selectedRoastBeans = ref(null)
const selectedRoastLevel = ref(null)
const quantity = ref(1)
const shippingAddresses = ref([])
const selectedShippingAddress = ref('')
const selectedDelivery = ref(1)

// Fetch initial data
const { data: customerData } = await supabase.from('customers').select('*')
customers.value = customerData

const { data: beansData } = await supabase.from('roast_beans').select('*')
roastBeans.value = beansData

const { data: roastLevelData } = await supabase.from('roast_coffee_level').select('*')
roastLevel.value = roastLevelData

const { data: promoData } = await supabase.from('promotions').select('*')
promotions.value = promoData


const { data: delivery_methods, error } = await supabase
  .from('delivery_methods')
  .select('*')
deliveryMethods.value = delivery_methods




const currentAddress = computed(() => {
  return shippingAddresses.value.find(addr => addr.id === selectedShippingAddress.value)
})

const totalPrice = computed(() => {
  const bean = roastBeans.value?.find(b => b.id === selectedRoastBeans.value?.id)
  return bean ? (bean.price_per_kg * quantity.value).toFixed(2) : 0
})

const appliedPromotion = computed(() => {
  return promotions.value.find(p =>
    totalQuantity() >= p.min_purchase_amount
  )
})

const finalPrice = computed(() => {
  const total = parseFloat(totalSubtotal())
  const promo = appliedPromotion.value
  return promo
    ? (total * (1 - promo.discount_percentage / 100)).toFixed(2)
    : total
})

const canCreateOrder = computed(() => {
  if (selectedDelivery.value === 2) {
    return cart.value.length > 0 && selectedShippingAddress.value

  } else
    return cart.value.length > 0
}
)

const canAddToCart = computed(() =>
  selectedCustomer.value &&
  selectedRoastBeans.value &&
  selectedRoastLevel.value &&
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
        total_amount: totalSubtotal(),
        discount_amount: appliedPromotion.value
          ? (totalSubtotal() * (appliedPromotion.value.discount_percentage / 100))
          : 0,
        final_amount: finalPrice.value,
        promotion_id: appliedPromotion.value?.id,
        shipping_address_id: selectedShippingAddress.value ? selectedShippingAddress.value : null,


      }
    ]).select()

    if (ordersError) {
      throw new Error(`Failed to create order: ${ordersError.message}`);
    }

    const orderId = ordersData[0].id


    // Prepare the array of order items
    const orderItems = cart.value.map(item => ({
      order_id: orderId,
      roast_beans_id: item.roast_bean.id,
      quantity: item.quantity,
      item_price: item.item_price,
      subtotal: parseFloat(item.subtotal),
      roast_level_id: item.roast_level.id,
    }));

    // Insert the order items into the 'order_items' table
    const { data: orderItemsData, error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItems);



    if (orderItemsError) {
      throw new Error(`Failed to create order item: ${orderItemsError.message}`);
    }

    // Insert order history

    const orderHistoryObj = cart.value.map(item => ({
      order_id: orderId
    }));

    const { data: orderHistory, error: orderHistoryError } = await supabase
      .from('order_status_history')
      .insert(orderHistoryObj);

    if (orderHistoryError) {
      throw new Error(`Failed to create order history: ${orderHistoryError.message}`);
    }

    // If both operations are successful, show a success message
    useNuxtApp().$toast.success('Order has been created');
    clearCart()
    resetForm()
    selectedCustomer.value = null
    loading.value = false
  } catch (error) {
    loading.value = false
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

const addToCart = () => {


  if (canAddToCart.value) {
    if (cart.value[0]?.customer_id !== selectedCustomer.value) {
      cart.value = []
    }

    const newItem = {
      customer_id: selectedCustomer.value,
      roast_bean: selectedRoastBeans.value,
      quantity: quantity.value,
      item_price: roastBeans.value.find(b => b.id === selectedRoastBeans.value?.id).price_per_kg,
      subtotal: totalPrice.value,
      roast_level: selectedRoastLevel.value
    }
    cart.value.push(newItem)
    // Optionally, clear the form fields after adding to cart
    resetForm()
  } else {
    alert('Please fill all required fields.')
  }
}

const resetForm = () => {

  selectedRoastBeans.value = null
  selectedRoastLevel.value = null
  quantity.value = 1
  selectedShippingAddress.value = ''
}
const removeFromCart = (index) => {
  cart.value.splice(index, 1);
};

const clearCart = () => {
  cart.value = []
}

const totalSubtotal = () => {
  if (cart.value.length > 0) {
    return cart.value.reduce((accumulator, currentItem) => {
      return accumulator + parseFloat(currentItem.subtotal);

    }, 0)
  }
}
const totalQuantity = () => {
  if (cart.value.length > 0) {
    return cart.value.reduce((accumulator, currentItem) => {
      return accumulator + parseFloat(currentItem.quantity);

    }, 0)
  }
}
</script>