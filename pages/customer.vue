<template>
    <div class="container mx-auto p-6">
        <h1 class="text-2xl font-bold mb-4">List of Customers</h1>

        <!-- Customer List Table -->
        <table class="w-full table table-zebra">
            <thead>
                <tr class="bg-base-200 text-primary font-bold">
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Company</th>
                    <th>Province</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="customer in customersData" :key="customer.id">
                    <td>{{ customer.firstname }} {{ customer.lastname }}</td>
                    <td>{{ customer.email }}</td>
                    <td>{{ customer.phone }}</td>
                    <td>{{ customer.company }}</td>
                    <td>{{ customer.province }}</td>
                    <td>
                        <button @click="showCustomerDetails(customer)" class="btn btn-xs btn-info">View Details</button>
                    </td>
                </tr>
            </tbody>
        </table>


        <!-- Customer Details Modal -->
        <dialog id="customerDetailsModal" class="modal">
            <div class="modal-box w-11/12 max-w-5xl bg-base-100">
                <h3 class="font-bold text-2xl text-primary flex items-center mb-4">
                    Customer Details
                </h3>
                <div v-if="selectedCustomer" class="space-y-4">
                    <p><strong>Name:</strong> {{ selectedCustomer.firstname }} {{ selectedCustomer.lastname }}</p>
                    <p><strong>Email:</strong> {{ selectedCustomer.email }}</p>
                    <p><strong>Phone:</strong> {{ selectedCustomer.phone }}</p>
                    <p><strong>Country:</strong> {{ selectedCustomer.country }}</p>
                    <p><strong>Street Address:</strong> {{ selectedCustomer.street_address }}</p>
                    <p><strong>City:</strong> {{ selectedCustomer.city }}</p>
                    <p><strong>Province:</strong> {{ selectedCustomer.province }}</p>
                    <p><strong>Zipcode:</strong> {{ selectedCustomer.zipcode }}</p>
                    <p><strong>Company:</strong> {{ selectedCustomer.company }}</p>
                    <!-- Shipping Information Table -->
                    <div class="flex mt-6">
                        <h4 class=" text-xl font-bold text-center flex-1">Shipping Information
                        </h4>
                        <button @click="showAddShippingForm = true" class="btn btn-sm btn-primary ml-2">+ New
                            Shipping</button>
                    </div>

                    <!-- Add Shipping Form -->
                    <div v-if="showAddShippingForm" class="mt-6 p-4 border rounded-lg shadow-md">
                        <button @click="showAddShippingForm = false" class="btn btn-sm btn-error mb-4">X</button>
                        <form @submit.prevent="" class="space-y-4">
                            <div>
                                <label for="receiver_name" class="label">
                                    <span class="label-text">Receiver Name</span>
                                </label>
                                <input type="text" id="receiver_name" v-model="newShippingAddress.receiver_name"
                                    placeholder="Receiver name" required class="input input-bordered w-full" />
                            </div>

                            <div>
                                <label for="phone" class="label">
                                    <span class="label-text">Phone</span>
                                </label>
                                <input type="text" id="phone" v-model="newShippingAddress.phone" placeholder="Phone"
                                    required class="input input-bordered w-full" />
                            </div>

                            <div>
                                <label for="shipping_company" class="label">
                                    <span class="label-text">Shipping Company</span>
                                </label>
                                <input type="text" id="shipping_company" v-model="newShippingAddress.shipping_company"
                                    placeholder="Shipping Company" required class="input input-bordered w-full" />
                            </div>

                            <div>
                                <label for="country" class="label">
                                    <span class="label-text">Country</span>
                                </label>
                                <input type="text" id="country" v-model="newShippingAddress.country"
                                    placeholder="Country" required class="input input-bordered w-full" />
                            </div>

                            <div>
                                <label for="Province" class="label">
                                    <span class="label-text">Province</span>
                                </label>
                                <input type="text" id="Province" v-model="newShippingAddress.province"
                                    placeholder="Province" required class="input input-bordered w-full" />
                            </div>

                            <div>
                                <label for="city" class="label">
                                    <span class="label-text">City</span>
                                </label>
                                <input type="text" id="city" v-model="newShippingAddress.city" placeholder="City"
                                    required class="input input-bordered w-full" />
                            </div>

                            <div>
                                <label for="branch_details" class="label">
                                    <span class="label-text">Branch Details</span>
                                </label>
                                <input type="text" id="branch_details" v-model="newShippingAddress.branch_details"
                                    placeholder="Branch Detail" required class="input input-bordered w-full" />
                            </div>

                            <button type="submit" class="btn btn-primary w-full" @click="createShippingInfo">
                                <span v-if="!loading">Add Shipping Address</span>
                                <span v-else class="loading loading-spinner loading-lg"></span>

                            </button>
                        </form>
                    </div>


                    <div
                        v-if="selectedCustomer.shipping_information && selectedCustomer.shipping_information.length > 0">
                        <table class="w-full table table-zebra mt-2">
                            <thead>
                                <tr class="bg-base-200 text-primary font-bold">
                                    <th>Receiver name</th>
                                    <th>phone</th>
                                    <th>Shipping Company</th>
                                    <th>Country</th>
                                    <th>Province</th>
                                    <th>City</th>
                                    <th>Branch Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(address, index) in selectedCustomer.shipping_information" :key="index">
                                    <td>{{ address.receiver_name }}</td>
                                    <td>{{ address.phone }}</td>
                                    <td>{{ address.shipping_company }}</td>
                                    <td>{{ address.country }}</td>
                                    <td>{{ address.province }}</td>
                                    <td>{{ address.city }}</td>
                                    <td>{{ address.branch_details }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p v-else>No shipping addresses available</p>
                </div>
                <div class="modal-action mt-6">
                    <form method="dialog" class="">
                        <button class="btn">Close</button>
                    </form>
                </div>

            </div>


        </dialog>

    </div>
</template>

<script setup>
const { $supabaseData, $supabaseClient } = useNuxtApp()
const customersData = ref(await $supabaseData.fetchCustomers())
const supabase = $supabaseClient

const selectedCustomer = ref(null)
const showAddShippingForm = ref(false)
const loading = ref(false)
const newShippingAddress = ref({
    receiver_name: '',
    phone: '',
    country: '',
    province: '',
    city: '',
    branch_details: '',
    shipping_company: ''
})

// Function to show customer details
const showCustomerDetails = (customer) => {
    selectedCustomer.value = customer
    const modal = document.getElementById('customerDetailsModal')
    if (modal) modal.showModal()

}

const createShippingInfo = async () => {

    loading.value = true

    try {

        const { data, error } = await supabase
            .from('shipping_information')
            .insert([
                {
                    receiver_name: newShippingAddress.value.receiver_name,
                    phone: newShippingAddress.value.phone,
                    country: newShippingAddress.value.country,
                    province: newShippingAddress.value.province,
                    city: newShippingAddress.value.city,
                    branch_details: newShippingAddress.value.branch_details,
                    shipping_company: newShippingAddress.value.shipping_company,
                    customer_id: selectedCustomer.value.id,
                },
            ])
            .select()

        if (error) {
            throw new Error(`Failed to create shipping info: ${error.message}`);
        }

        if (data) {
            loading.value = false
            useNuxtApp().$toast.success('New shipping info has been created');
            customersData.value = await $supabaseData.fetchCustomers()
            showAddShippingForm.value = false
            resetShippingForm()
        }

    } catch (error) {
        loading.value = false
        useNuxtApp().$toast.error(error.message || 'An error occurred while adding new shipping info.');

    }


}

const resetShippingForm = () => {
    newShippingAddress.value = {
        receiver_name: '',
        phone: '',
        country: '',
        province: '',
        city: '',
        branch_details: '',
        shipping_company: ''
    }
}

</script>