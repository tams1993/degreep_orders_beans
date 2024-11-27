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

          </div>
          <div class="stat-title">Remaining Orders</div>
          <div class="stat-value text-error">{{ remainingOrdersCount }}</div>
          <div class="grid grid-cols-2">
            <div>
              <div class="stat-title">Placed Orders</div>
              <div class="stat-value text-secondary">{{ placedOrder.length }}</div>
            </div>

            <div>
              <div class="stat-title">Delivered Orders</div>

              <div class="stat-value text-secondary">{{ deliveredOrder.length }}</div>
            </div>


          </div>

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

                  <div :class="containerClass(order)" class="rounded-2xl p-2">
                    <!-- Loop over statusMap for displaying each status -->
                    <div v-for="(status, index) in statusMap" :key="index" class="my-1">
                      <!-- Check if the current status (index) exists in order_status_history -->
                      <input type="checkbox" :id="'status-' + index" :value="index"
                        :checked="order?.order_status_history.some(statusData => statusData.status == index)"
                        :disabled="order?.order_status_history.some(statusData => statusData.status == index)"
                        @change="handleCheckboxChange(order, index, $event)" />
                      {{ index }}
                      <label class="" :for="'status-' + index">{{ status }}</label>
                    </div>
                  </div>

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
const { getStatusDescription, statusMap } = useOrderStatus();
const { $supabaseData } = useNuxtApp()

const ordersData = await $supabaseData.fetchOrders()
const remainingOrdersCount = ref(0)
// Filter the orders with status 1 or 3 in the order_status_history array
const placedOrder = ordersData.filter(order => {
  // Check if the order has a status of 1 or 3
  const placedOrder = order.order_status_history.some(status => status.status === 1);

  // Exclude orders with status 4 if they also have status 1 or 3
  const excludeData = order.order_status_history.some(status => status.status === 4);

  // Return orders that have status 1 or 3 but do not have status 4
  return placedOrder && !excludeData;
});

const deliveredOrder = ordersData.filter(order => {
  // Check if the order has a status of 1 or 3
  const deliveredOrder = order.order_status_history.some(status => status.status === 3);

  // Exclude orders with status 4 if they also have status 1 or 3
  const excludeData = order.order_status_history.some(status => status.status === 4);

  // Return orders that have status 1 or 3 but do not have status 4
  return deliveredOrder && !excludeData;
});


remainingOrdersCount.value = placedOrder.length + deliveredOrder.length


const { $supabaseClient } = useNuxtApp()
const supabase = $supabaseClient

const recentOrders = ref(ordersData || [])
const selectedOrder = ref()
const selectedOrderStatus = ref()
const selectedOrderItems = ref([])

onMounted(async () => {

})

const { data: salesData } = await supabase
  .from('orders_beans')
  .select('final_amount')


const ordersBeans = supabase.channel('custom-all-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'order_status_history' },
    async (payload) => {
      recentOrders.value = await $supabaseData.fetchOrders()
    }
  )
  .subscribe()

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

// Computed property for dynamic background class
const containerClass = (order) => {
  const statuses = order.order_status_history.map((s) => s.status);

  // If index 4 ("Canceled") is checked, use a specific color
  if (statuses.includes(4)) {
    return 'bg-error bg-opacity-50'; // Change this to the desired class for "Canceled"
  }

  // If indexes 1, 2, or 3 are checked, use a different color
  if (statuses.some((status) => [1, 2, 3].includes(status))) {
    return 'bg-success bg-opacity-50'; // Change this to the desired class for "Placed", "Paid", or "Delivered"
  }

  // Default background color
  return 'bg-accent';
};

const updateOrderStatus = async (orderId, status) => {
  try {
    const { data, error } = await supabase
      .from('order_status_history')
      .insert([{ order_id: orderId, status: status }]).select()



    if (error) throw error

    useNuxtApp().$toast.success('New status updated');



    // Optionally update local state or show notification
    // this.orders = this.orders.map(o => 
    //   o.id === order.id ? { ...o, status: order.status } : o
    // )
  } catch (error) {
    console.error('Error updating status:', error)
    useNuxtApp().$toast.error(error.message || 'Error updating status.');

  }
}

const handleCheckboxChange = (order, statusIndex, event) => {
  const isChecked = event.target.checked;

  // Check if the status already exists in the order's history
  const alreadyChecked = order.order_status_history.some(
    (statusData) => statusData.status === statusIndex
  );

  if (!isChecked && alreadyChecked) {
    // Prevent unchecking by forcing the checkbox back to its checked state
    event.target.checked = true;
    return;
  }

  if (isChecked) {
    // Call your logic to update the status
    updateOrderStatus(order.id, statusIndex);
  }
}
</script>