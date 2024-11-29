<template>
    <div class="container mx-auto p-6">

        <div class="drawer drawer-end">
            <input id="roast-beans-drawer" type="checkbox" class="drawer-toggle" />
            <div class="drawer-content">
                <!-- Page content here -->
                <div>
                    <div class="flex my-4">
                        <h2 class="text-2xl font-bold mb-6 flex-1">Roast Beans</h2>
                        <label for="roast-beans-drawer" class="btn btn-primary drawer-button"> + Add new Roast
                            beans</label>
                    </div>



                    <!-- Grid Display -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        v-if="roastBeansData">
                        <!-- Card for each bean -->
                        <div v-for="bean in roastBeansData" :key="bean.id" class="card bg-secondary shadow-md">
                            <div class="card-body">
                                <h3 class="card-title text-xl font-bold">{{ bean.name }}</h3>
                                <p class="text-gray-500 mb-4">{{ bean.description }}</p>
                                <div class="flex items-center justify-between">
                                    <span class="font-semibold">Bag size:</span>
                                    <span class="text-primary font-bold">
                                        {{ bean.roast_beans_packages.packages_size.quantity }}
                                        {{ bean.roast_beans_packages.packages_size.units.unit_symbol }}

                                    </span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="font-semibold">Price:</span>
                                    <span class="text-primary font-bold">{{
                                        formatLakPrice(bean.roast_beans_packages.price) }}</span>
                                </div>
                                <div class="flex items-center justify-between mt-2">
                                    <span class="font-semibold">Available:</span>
                                    <span
                                        :class="bean.available ? 'text-green-500 font-bold' : 'text-red-500 font-bold'">
                                        {{ bean.available ? 'Yes' : 'No' }}
                                    </span>
                                </div>
                                <div class="card-actions justify-end mt-4">
                                    <button @click="editBean(bean)" class="btn btn-sm btn-info">Edit</button>
                                    <button @click="deleteBean(bean.id)" class="btn btn-sm btn-error">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Add/Edit Bean Modal -->
                    <dialog id="beanModal" class="modal">
                        <form method="dialog" class="modal-box">
                            <h3 class="font-bold text-lg mb-4">{{ isEditing ? 'Edit Bean' : 'Add New Bean' }}</h3>

                            <div class="form-control mb-4">
                                <label class="label" for="name">
                                    <span class="label-text">Name</span>
                                </label>
                                <input v-model="currentBean.name" id="name" type="text" placeholder="Bean Name"
                                    class="input input-bordered">
                            </div>

                            <div class="form-control mb-4">
                                <label class="label" for="description">
                                    <span class="label-text">Description</span>
                                </label>
                                <textarea v-model="currentBean.description" id="description"
                                    placeholder="Bean Description" class="textarea textarea-bordered"></textarea>
                            </div>

                            <div class="form-control mb-4">
                                <label class="label" for="price">
                                    <span class="label-text">Price per kg (LAK) Need to FIX!</span>
                                </label>
                                <input v-model="currentBean.price_per_kg" id="price" type="number"
                                    placeholder="Price per kg" class="input input-bordered">
                            </div>

                            <div class="form-control mb-4">
                                <label class="label cursor-pointer">
                                    <span class="label-text">Available</span>
                                    <input v-model="currentBean.available" type="checkbox" class="toggle">
                                </label>
                            </div>

                            <div class="modal-action">
                                <button @click="saveBean" class="btn btn-primary">{{ isEditing ? 'Update' : 'Add'
                                    }}</button>
                                <button type="button" class="btn" @click="closeModal">Cancel</button>
                            </div>
                        </form>
                    </dialog>
                </div>
            </div>
            <div class="drawer-side">
                <label for="roast-beans-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
                <div class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    <div class="container mx-auto p-6">
                        <h2 class="text-2xl font-bold mb-6">Add New Roast Bean</h2>
                        <form @submit.prevent="addRoastBean" class="space-y-6">
                            <!-- Name -->
                            <div class="form-control">
                                <label class="label" for="name">
                                    <span class="label-text">Bean Name</span>
                                </label>
                                <input v-model="newBean.name" id="name" type="text" placeholder="Enter bean name"
                                    class="input input-bordered" required />
                            </div>

                            <!-- Description -->
                            <div class="form-control">
                                <label class="label" for="description">
                                    <span class="label-text">Description</span>
                                </label>
                                <textarea v-model="newBean.description" id="description" placeholder="Enter description"
                                    class="textarea textarea-bordered" required></textarea>
                            </div>

                            <select id="quantitySelect" class="select select-bordered w-full max-w-xs"
                                v-model="newBean.bag_size.id">
                                <option disabled value="">Choose a quantity</option>
                                <option v-for="option in packages_size" :key="option.id" :value="option.id">
                                    {{ option.quantity }} {{ option.units.unit_symbol }}
                                </option>
                            </select>


                            <!-- Price per kg -->
                            <div class="form-control">
                                <label class="label" for="price">
                                    <span class="label-text">Price</span>
                                </label>
                                <input v-model="newBean.bag_size.price" id="price" type="number" step="0.01"
                                    placeholder="Enter price" class="input input-bordered" required />
                            </div>

                            <select id="coffee-select" v-model="newBean.coffee_bean_id" class="select select-bordered">
                                <option disabled value="">Choose a coffee</option>
                                <option v-for="coffee in coffee_bean" :key="coffee.id" :value="coffee.id">
                                    {{ coffee.coffee_region_origin.region_origin }} -
                                    {{ coffee.coffee_process.process }} -
                                    {{ coffee.coffee_variety_relationship.child.type }}
                                </option>
                            </select>

                            <!-- Availability -->
                            <div class="form-control">
                                <label class="label cursor-pointer">
                                    <span class="label-text">Available</span>
                                    <input v-model="newBean.available" type="checkbox" class="toggle" />
                                </label>
                            </div>

                            <!-- Submit Button -->
                            <button type="submit" class="btn btn-primary w-full">
                                Add Bean
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>

    </div>

</template>

<script setup>

const { $supabaseClient } = useNuxtApp()
const { formatLakPrice, calculateTotalLakPrice } = useLakPrice()

const roastBeansData = ref()
const currentBean = ref({
    id: null,
    name: '',
    description: '',
    bag_size: {
        price: 0,
        id: null
    },
    available: false,
    coffee_bean_id: null
});
const newBean = ref({
    name: '',
    description: '',
    bag_size: {
        price: 0,
        id: null
    },
    available: false,
    coffee_bean_id: null


})

const { data: packages_size } = await $supabaseClient.from('packages_size').select(`
            id,
            quantity,
            units(
                    unit_name, 
                    unit_symbol
                )
          `)

const { data: roast_beans } = await $supabaseClient.from('roast_beans').select(`
            *,
            roast_beans_packages(
            price, packages_size(
                id, 
                quantity, 
                units(
                    unit_name, 
                    unit_symbol
                    )
                )
            )
          `)
const { data: coffee_bean } = await $supabaseClient.from('coffee_bean').select(`
            id,
            coffee_region_origin(region_origin,
                coffee_country_origin(country_origin)
            ),
            coffee_variety_relationship(
                    parent:coffee_variety_parent_id(type),
                    child:coffee_variety_child_id(type)
                  ),
            coffee_process(process)
          `)

roastBeansData.value = roast_beans

const isEditing = ref(false);

const editBean = (bean) => {
    isEditing.value = true;
    currentBean.value = { ...bean };
    document.getElementById('beanModal').showModal();
};

const addBean = () => {
    isEditing.value = false;
    currentBean.value = {
        id: null,
        name: '',
        description: '',
        price_per_kg: null,
        available: false,
    };
    document.getElementById('beanModal').showModal();
};

const saveBean = () => {
    if (isEditing.value) {
        const index = roastBeansData.value.findIndex((b) => b.id === currentBean.value.id);
        roastBeansData.value[index] = { ...currentBean.value };
    } else {
        roastBeansData.value.push({
            ...currentBean.value,
            id: Date.now(),
        });
    }
    closeModal();
};

const deleteBean = (id) => {
    roastBeansData.value = roastBeansData.value.filter((bean) => bean.id !== id);
};


const closeModal = () => {
    document.getElementById('beanModal').close();
};

const addRoastBean = () => {
    console.log(newBean.value)
}
</script>