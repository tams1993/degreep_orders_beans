<template>
    <div class="container p-6 mx-auto">

        <div class="drawer drawer-end">
            <input id="customer-drawer" type="checkbox" class="drawer-toggle" />
            <div class="drawer-content">
                <!-- Page content here -->
                <div class="flex my-4">
                    <h1 class="text-2xl font-bold mb-4 flex-1">List of Customers</h1>
                    <label for="customer-drawer" class="btn btn-primary drawer-button"> + Add new customer</label>

                </div>

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
                                <button @click="showCustomerDetails(customer)" class="btn btn-xs btn-info">View
                                    Details</button>
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
                            <div class="grid grid-cols-2 gap-4 p-4 my-4">
                                <div class="space-y-4">
                                    <p><strong>Name:</strong> {{ selectedCustomer.firstname }} {{
                                        selectedCustomer.lastname
                                        }}
                                    </p>
                                    <p><strong>Email:</strong> {{ selectedCustomer.email }}</p>
                                    <p><strong>Phone:</strong> {{ selectedCustomer.phone }}</p>
                                    <p><strong>Country:</strong> {{ selectedCustomer.country }}</p>
                                    <p><strong>Street Address:</strong> {{ selectedCustomer.street_address }}</p>
                                </div>
                                <div class="space-y-4">
                                    <p><strong>City:</strong> {{ selectedCustomer.city }}</p>
                                    <p><strong>Province:</strong> {{ selectedCustomer.province }}</p>
                                    <p><strong>Zipcode:</strong> {{ selectedCustomer.zipcode }}</p>
                                    <p><strong>Company:</strong> {{ selectedCustomer.company }}</p>
                                </div>

                            </div>


                            <!-- Shipping Information Table -->
                            <div class="flex mt-6">
                                <h4 class=" text-xl font-bold text-center flex-1">Shipping Information
                                </h4>
                                <button @click="showAddShippingForm = true" class="btn btn-sm btn-primary ml-2">+ New
                                    Shipping</button>
                            </div>

                            <!-- Add Shipping Form -->
                            <div v-if="showAddShippingForm" class="mt-6 p-4 border rounded-lg shadow-md">
                                <button @click="showAddShippingForm = false"
                                    class="btn btn-sm btn-error mb-4">X</button>
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
                                        <input type="text" id="phone" v-model="newShippingAddress.phone"
                                            placeholder="Phone" required class="input input-bordered w-full" />
                                    </div>

                                    <div>
                                        <label for="shipping_company" class="label">
                                            <span class="label-text">Shipping Company</span>
                                        </label>
                                        <input type="text" id="shipping_company"
                                            v-model="newShippingAddress.shipping_company" placeholder="Shipping Company"
                                            required class="input input-bordered w-full" />
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
                                        <input type="text" id="city" v-model="newShippingAddress.city"
                                            placeholder="City" required class="input input-bordered w-full" />
                                    </div>

                                    <div>
                                        <label for="branch_details" class="label">
                                            <span class="label-text">Branch Details</span>
                                        </label>
                                        <input type="text" id="branch_details"
                                            v-model="newShippingAddress.branch_details" placeholder="Branch Detail"
                                            required class="input input-bordered w-full" />
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
                                        <tr v-for="(address, index) in selectedCustomer.shipping_information"
                                            :key="index">
                                            <td>{{ address.receiver_name }}</td>
                                            <td>{{ address.phone }}</td>
                                            <td>{{ address.shipping_company }}</td>
                                            <td>{{ address.country }}</td>
                                            <td>{{ address.province }}</td>
                                            <td>{{ address.city }}</td>
                                            <td>{{ address.branch_details }}</td>
                                            <td class="flex items-center">
                                                <button @click="deleteShippingID = address.id"
                                                    v-if="deleteShippingID !== address.id">
                                                    <Icon name="material-symbols:delete-outline" class="mx-2"
                                                        size="2em" />
                                                </button>
                                                <div v-if="deleteShippingID === address.id"
                                                    class="flex items-center gap-2">
                                                    <a class="link link-hover"
                                                        @click="deleteShippingAddress(address.id)">
                                                        Sure?
                                                    </a>
                                                    <a class="link link-hover" @click="deleteShippingID = ''">
                                                        Cancel
                                                    </a>
                                                </div>
                                            </td>
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

            <div class="drawer-side">
                <label for="customer-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
                <div class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    <!-- Sidebar content here -->
                    <h2 class="text-2xl font-bold mb-4 text-primary">Customer Information</h2>
                    <form @submit.prevent="submitCustomerForm" class="space-y-4">
                        <!-- Firstname -->
                        <div>
                            <label for="firstname" class="label">
                                <span class="label-text">First Name</span>
                            </label>
                            <input type="text" id="firstname" v-model="customerObj.firstname"
                                placeholder="Enter first name" class="input input-bordered w-full" required />
                        </div>

                        <!-- Lastname -->
                        <div>
                            <label for="lastname" class="label">
                                <span class="label-text">Last Name</span>
                            </label>
                            <input type="text" id="lastname" v-model="customerObj.lastname"
                                placeholder="Enter last name" class="input input-bordered w-full" />
                        </div>

                        <!-- Email -->
                        <div>
                            <label for="email" class="label">
                                <span class="label-text">Email</span>
                            </label>
                            <input type="email" id="email" v-model="customerObj.email" placeholder="Enter email"
                                class="input input-bordered w-full" />
                        </div>

                        <!-- Phone -->
                        <div>
                            <label for="phone" class="label">
                                <span class="label-text">Phone</span>
                            </label>
                            <input type="tel" id="phone" v-model="customerObj.phone" placeholder="Enter phone number"
                                class="input input-bordered w-full" required />
                        </div>

                        <!-- Company -->
                        <div>
                            <label for="company" class="label">
                                <span class="label-text">Company</span>
                            </label>
                            <input type="text" id="company" v-model="customerObj.company"
                                placeholder="Enter company name" class="input input-bordered w-full" />
                        </div>

                        <!-- Address Section -->
                        <div>
                            <h3 class="text-lg font-bold mt-6 mb-2">Address Information</h3>
                            <div>
                                <label for="street_address" class="label">
                                    <span class="label-text">Street Address</span>
                                </label>
                                <input type="text" id="street_address" v-model="customerObj.street_address"
                                    placeholder="Enter street address" class="input input-bordered w-full" />
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label for="city" class="label">
                                        <span class="label-text">City</span>
                                    </label>
                                    <input type="text" id="city" v-model="customerObj.city" placeholder="Enter city"
                                        class="input input-bordered w-full" />
                                </div>
                                <div>
                                    <label for="province" class="label">
                                        <span class="label-text">Province</span>
                                    </label>
                                    <input type="text" id="province" v-model="customerObj.province"
                                        placeholder="Enter province" class="input input-bordered w-full" />
                                </div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label for="zipcode" class="label">
                                        <span class="label-text">Zip Code</span>
                                    </label>
                                    <input type="number" id="zipcode" v-model="customerObj.zipcode"
                                        placeholder="Enter zip code" class="input input-bordered w-full" />
                                </div>
                                <div>
                                    <label for="country" class="label">
                                        <span class="label-text">Country</span>
                                    </label>
                                    <input type="text" id="country" v-model="customerObj.country"
                                        placeholder="Enter country" class="input input-bordered w-full" />
                                </div>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <button type="submit" class="btn btn-primary w-full">
                            <span class="loading loading-spinner loading-md" v-if="loading"></span>
                            Submit
                        </button>
                    </form>

                </div>
            </div>
        </div>

        <Loading :loading="dataLoading" />


    </div>
</template>

<script setup>
const { $supabaseData, $supabaseClient } = useNuxtApp()
const customersData = ref(await $supabaseData.fetchCustomers())
const supabase = $supabaseClient
const dataLoading = ref(true)

const selectedCustomer = ref(null)
const showAddShippingForm = ref(false)
const loading = ref(false)
const deleteShippingID = ref('')
const newShippingAddress = ref({
    receiver_name: '',
    phone: '',
    country: '',
    province: '',
    city: '',
    branch_details: '',
    shipping_company: ''
})

const customerObj = ref({
    firstname: '',
    lastname: '',
    country: '',
    street_address: '',
    city: '',
    province: '',
    zipcode: 0,
    phone: '',
    email: '',
    company: '',
})

watchEffect(() => {
    if(customersData) {
        dataLoading.value = false
    }
})


onMounted(() => {
    supabase.channel('custom-all-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'customers' },
            async (payload) => {
                customersData.value = await $supabaseData.fetchCustomers()

            }
        )
        .subscribe()
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
            selectedCustomer.value.shipping_information.push(data[0])
            resetShippingForm()
        }

    } catch (error) {
        loading.value = false
        useNuxtApp().$toast.error(error.message || 'An error occurred while adding new shipping info.');

    }


}

// Function to delete a shipping address
const deleteShippingAddress = async (addressId) => {
    if (!selectedCustomer.value || !addressId) return;

    const { data, error } = await supabase
        .from('shipping_information')
        .delete()
        .eq('id', addressId);

    if (error) {
        useNuxtApp().$toast.error(error.message || 'Error deleting shipping address.');
        return;
    }

    useNuxtApp().$toast.success('Shipping info has been deleted');


    selectedCustomer.value.shipping_information = selectedCustomer.value.shipping_information.filter(address => address.id !== addressId)
    customersData.value = await $supabaseData.fetchCustomers()

};

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

const resetCustomerForm = () => {

    customerObj.value = {
        firstname: '',
        lastname: '',
        country: '',
        street_address: '',
        city: '',
        province: '',
        zipcode: 0,
        phone: '',
        email: '',
        company: '',
    }


}
const submitCustomerForm = async () => {

    loading.value = true

    try {

        const { data, error } = await supabase
            .from('customers')
            .insert([
                customerObj.value
            ])
            .select()

        if (error) {
            throw new Error(`Failed to create order history: ${error.message}`);
        }

        // If both operations are successful, show a success message
        useNuxtApp().$toast.success(`New customer has been created: ${data[0].firstname} ${data[0].lastname}`);
        if (data) {
            loading.value = false
            document.getElementById('customer-drawer').checked = false;
            resetCustomerForm()

        }

    } catch (error) {

        loading.value = false
        useNuxtApp().$toast.error(error.message || 'An error occurred while creating the order.');

    }


}

</script>
