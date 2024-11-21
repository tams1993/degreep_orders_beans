<template>
    <div class="container mx-auto p-4">
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-title">Total Sales</div>
          <div class="stat-value">{{ formatLakPrice(totalSales) }}</div>
        </div>
        <div class="stat">
          <div class="stat-title">Total Orders</div>
          <div class="stat-value">{{ totalOrders }}</div>
        </div>
      </div>
  
      <div class="mt-8">
        <h2 class="text-xl font-bold mb-4">Recent Orders</h2>
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id">
                <td>{{ order.id }}</td>
                <td>{{ order.customer.firstname }} {{ order.customer.lastname }}</td>
                <td>{{ formatLakPrice(order.final_amount) }}</td>
                <td>{{ new Date(order.order_date).toLocaleDateString() }}</td>
                <td>
                  <button 
                    @click="showOrderDetails(order)" 
                    class="btn btn-xs btn-info"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Order Details Modal -->
      <dialog id="orderDetailsModal" class="modal">
        <div class="modal-box w-11/12 max-w-5xl">
          <h3 class="font-bold text-lg">Order Details</h3>
          <div v-if="selectedOrder" class="mt-4">
            <h4 class="text-md font-semibold">Order Items</h4>
            <table class="table w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Roast Beans</th>
                  <th>Process</th>
                  <th>Roast level</th>
                  <th>Quantity</th>
                  <th>Item Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selectedOrderItems" :key="item.id">
                  <td>{{ selectedOrderItems.length }}</td>
                  <td>{{ item.roast_beans.coffee_bean.coffee_region_origin.region_origin }} {{ item.roast_beans.coffee_bean.coffee_variety_relationship.parent.type }} {{ item.roast_beans.coffee_bean.coffee_variety_relationship.child.type }}</td>
                  <td>{{ item.roast_beans.coffee_bean.coffee_process.process }} </td>
                  <td>{{ item.roast_beans.roast_coffee_level.level }}</td>
                  <td>{{ item.quantity }} kg</td>
                  <td>{{ formatLakPrice(item.item_price) }}/kg</td>
                  <td>{{ formatLakPrice(item.subtotal) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-action">
            <form method="dialog">
              <button class="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  </template>
  
  <script setup>
  const { formatLakPrice, calculateTotalLakPrice } = useLakPrice()

  const {$supabaseData} = useNuxtApp()

  const ordersData = await $supabaseData.fetchOrders()

  const supabase = useSupabase()

  const recentOrders = ref(ordersData || [])
  const selectedOrder = ref(null)
  const selectedOrderItems = ref([])
  
  const { data: salesData } = await supabase
    .from('orders_beans')
    .select('final_amount')
  
  const totalSales = computed(() => 
    salesData?.reduce((sum, order) => sum + order.final_amount, 0).toFixed(2) || 0
  )
  
  const totalOrders = computed(() => salesData?.length || 0)
  const showOrderDetails = (order) => {
  selectedOrder.value = order
  selectedOrderItems.value = order.order_items
  
  // Open modal
  const modal = document.getElementById('orderDetailsModal')
  if (modal) modal.showModal()
  }
  </script>