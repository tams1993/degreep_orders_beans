<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Stats Overview -->
    <div class="grid gap-4 mb-8">
      <div class="stats shadow bg-base-100">
        <div class="stat">
          <div class="stat-title">Total Sales</div>
          <div class="stat-value text-primary">{{ formatLakPrice(totalSales) }}</div>
          <div class="stat-desc">Last 30 days</div>
        </div>

        <div class="stat">
          <div class="stat-title">Total Orders</div>
          <div class="stat-value text-secondary">{{ totalOrders }}</div>
          <div class="stat-desc">+{{ (recentOrders?.length || 0) }} new</div>
        </div>

        <div class="stat">
          <div class="stat-figure text-accent">
            <Icon name="material-symbols:check-circle" class="mx-2" size="2em" />

          </div>
          <div class="stat-title">Completed Orders</div>
          <div class="stat-value text-accent">{{ completedOrders }}</div>
          <div class="stat-desc">Fully processed</div>
        </div>
      </div>
    </div>

    <!-- Recent Orders Section -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="flex justify-between items-center mb-4">
          <h2 class="card-title">Recent Orders</h2>

        </div>

        <div class="">
          <table class="table table-zebra">
            <thead>
              <tr class="bg-base-200">
                <th>Order Number</th>
                <th>Customer</th>
                <th>Total Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id" :class="{
                'bg-success/10': order?.status === 'completed',
                'bg-warning/10': order?.status === 'processing',
                'bg-error/10': order?.status === 'cancelled'
              }">
                <td>{{ order?.order_number }}</td>
                <td>
                  <div class="flex items-center space-x-3">
                    <div class="avatar placeholder">
                      <div class="bg-neutral text-neutral-content rounded-full w-8 h-8">
                        <span>{{ (order?.customer?.firstname?.[0] || '') + (order.customer?.lastname?.[0] || '')
                          }}</span>
                      </div>
                    </div>
                    <div>
                      <div class="font-bold">
                        {{ order?.customer?.firstname }} {{ order?.customer?.lastname }}
                      </div>
                      <div class="text-sm opacity-50">{{ order?.customer?.email }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ formatLakPrice(order?.final_amount) }}</td>
                <td>{{ new Date(order?.order_date).toLocaleDateString() }}</td>
                <td>
                  <select class="badge badge-lg select select-sm select-bordered w-full max-w-xs" :class="{
                    'badge-success': order?.status === 3,
                    'badge-warning': order?.status === 1,
                    'badge-info': order?.status === 2,
                    'badge-error': order?.status === 4
                  }" v-model="order.status" @change="updateOrderStatus(order)">
                    <option :value=1>Placed</option>
                    <option :value=2>Paid</option>
                    <option :value=3>Delivered</option>
                    <option :value=4>Cancelled</option>
                  </select>
                </td>
                <td>
                  <div class="flex space-x-2">
                    <button @click="showOrderDetails(order)" class="btn btn-xs btn-info">
                      View Details
                    </button>

                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Order Details Modal (same as before) -->
    <dialog id="orderDetailsModal" class="modal">
      <div class="modal-box w-11/12 max-w-5xl bg-base-100">
        <!-- Header with Order Status -->
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-bold text-2xl text-primary flex items-center">
            <Icon name="mdi:file-edit" class="mx-2" />
            Order Details
          </h3>
          <div class="badge badge-lg" :class="{
            'badge-success': selectedOrder?.status === 3,
            'badge-warning': selectedOrder?.status === 1,
            'badge-info': selectedOrder?.status === 2,
            'badge-error': selectedOrder?.status === 4
          }">
            {{ getStatusDescription(selectedOrder?.status).toUpperCase() }}
          </div>
        </div>

        <!-- Order and Customer Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-base-200 p-4 rounded-lg">
            <h4 class="font-semibold text-lg text-secondary mb-3 flex items-center">
              <Icon name="mdi:information-slab-circle" class="mx-2" />
              Order Information
            </h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-base-content/70">Order Number:</span>
                <span class="font-medium text-primary">{{ selectedOrder?.order_number }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-base-content/70">Date:</span>
                <span class="font-medium">{{ new Date(selectedOrder?.order_date).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-base-content/70">Total Amount:</span>
                <span class="font-bold text-accent">{{ formatLakPrice(selectedOrder?.final_amount) }}</span>
              </div>
            </div>
          </div>

          <div class="bg-base-200 p-4 rounded-lg">
            <h4 class="font-semibold text-lg text-secondary mb-3 flex items-center">
              <Icon name="material-symbols:person" class="mx-2" />

              Customer Details
            </h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-base-content/70">Name:</span>
                <span class="font-medium">
                  {{ selectedOrder?.customer?.firstname }} {{ selectedOrder?.customer?.lastname }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-base-content/70">Email:</span>
                <span class="font-medium text-info">{{ selectedOrder?.customer?.email }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-base-content/70">Phone:</span>
                <span class="font-medium">{{ selectedOrder?.customer?.phone || 'N/A' }}</span>
              </div>
            </div>
          </div>
          <div class="bg-base-200 p-4 rounded-lg">
            <h4 class="font-semibold text-lg text-secondary mb-3 flex items-center">
              <Icon name="material-symbols:person" class="mx-2" />

              Shipping Details
            </h4>
            <div class="space-y-2" v-if="selectedOrder">
              <div class="flex justify-between">
                <span class="text-base-content/70">Receiver name:</span>
                <span class="font-medium">
                  {{ selectedOrder?.shipping_information.receiver_name }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-base-content/70">Phone:</span>
                <span class="font-medium text-info">{{ selectedOrder?.shipping_information.phone }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-base-content/70">Shipping company:</span>
                <span class="font-medium">{{ selectedOrder?.shipping_information.shipping_company || 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-base-content/70">Country:</span>
                <span class="font-medium">{{ selectedOrder?.shipping_information.country || 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-base-content/70">Province:</span>
                <span class="font-medium">{{ selectedOrder?.shipping_information.province || 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-base-content/70">City:</span>
                <span class="font-medium">{{ selectedOrder?.shipping_information.city || 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-base-content/70">Branch details:</span>
                <span class="font-medium">{{ selectedOrder?.shipping_information.branch_details || 'N/A' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="bg-base-200 rounded-lg p-4">
          <h4 class="font-semibold text-lg text-secondary mb-3 flex items-center">
            <Icon name="material-symbols:format-list-bulleted" class="mx-2" />

            Order Items
          </h4>
          <div class="overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr class="bg-base-300">
                  <th class="text-base-content">#</th>
                  <th class="text-base-content">Roast Beans</th>
                  <th class="text-base-content">Process</th>
                  <th class="text-base-content">Quantity</th>
                  <th class="text-base-content">Roast Level</th>
                  <th class="text-base-content">Item Price</th>
                  <th class="text-base-content">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in selectedOrderItems" :key="item.id"
                  class="hover:bg-base-300 transition-colors">
                  <td class="text-base-content/70">{{ index + 1 }}</td>
                  <td>
                    <div class="font-medium text-primary">
                      {{ item.roast_beans.coffee_bean.coffee_region_origin.region_origin }}
                    </div>
                    <div class="text-xs text-base-content/50">
                      {{ item.roast_beans.coffee_bean.coffee_variety_relationship.parent.type }}
                      {{ item.roast_beans.coffee_bean.coffee_variety_relationship.child.type }}
                    </div>
                  </td>
                  <td class="text-base-content/80">
                    {{ item.roast_beans.coffee_bean.coffee_process.process }}
                  </td>
                  <td class="font-medium text-accent">{{ item.quantity }} kg</td>
                  <td class="text-base-content/80">{{ item.roast_coffee_level.level }}</td>
                  <td class="text-base-content/80">{{ formatLakPrice(item.item_price) }}/kg</td>
                  <td class="font-bold text-secondary">{{ formatLakPrice(item.subtotal) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="modal-action mt-6">
          <form method="dialog">
            <button class="btn btn-primary">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>


<script setup>
// definePageMeta({
//   middleware: ['auth']
// })
const { formatLakPrice, calculateTotalLakPrice } = useLakPrice()
const { getStatusDescription } = useOrderStatus();
const { $supabaseData } = useNuxtApp()

const ordersData = await $supabaseData.fetchOrders()

const {$supabaseClient} = useNuxtApp()
const supabase = $supabaseClient

const recentOrders = ref(ordersData || [])
const selectedOrder = ref()
const selectedOrderStatus = ref()
const selectedOrderItems = ref([])

const { data: salesData } = await supabase
  .from('orders_beans')
  .select('final_amount')

const totalSales = computed(() =>
  salesData?.reduce((sum, order) => sum + order?.final_amount, 0).toFixed(2) || 0
)

const totalOrders = computed(() => salesData?.length || 0)
const showOrderDetails = (order) => {
  selectedOrder.value = order
  selectedOrderItems.value = selectedOrder.value.order_items


  // Open modal
  const modal = document.getElementById('orderDetailsModal')
  if (modal) modal.showModal()
}

const updateOrderStatus = async (order) => {
  try {
    const { data, error } = await supabase
      .from('orders_beans')
      .update({ status: order.status })
      .eq('id', order.id)

    if (error) throw error

    // Optionally update local state or show notification
    // this.orders = this.orders.map(o => 
    //   o.id === order.id ? { ...o, status: order.status } : o
    // )
  } catch (error) {
    console.error('Error updating status:', error)
  }
}
</script>