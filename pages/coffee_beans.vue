<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Main Content -->
    <div class="drawer drawer-end">
      <input id="coffee-bean-drawer" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="flex justify-between items-center mb-4">
              <h2 class="card-title">Coffee List</h2>
              <label
                for="coffee-bean-drawer"
                class="btn btn-primary drawer-button"
                >+ Add New Coffee Bean</label
              >
            </div>
            <div class="">
              <table class="table table-zebra w-full">
                <thead>
                  <tr class="bg-base-200">
                    <th>Country</th>
                    <th>Region</th>
                    <th>Parent variety</th>
                    <th>Child variety</th>
                    <th>Process</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="coffee in coffeeBean" :key="coffee.id">
                    <td>
                      {{
                        coffee.coffee_region_origin.coffee_country_origin
                          .country_origin
                      }}
                    </td>
                    <td>{{ coffee.coffee_region_origin.region_origin }}</td>
                    <td>
                      {{ coffee.coffee_variety_relationship.parent.type }}
                    </td>
                    <td>{{ coffee.coffee_variety_relationship.child.type }}</td>
                    <td>{{ coffee.coffee_process.process }}</td>
                    <td>
                      <div class="flex space-x-2">
                        <button
                          @click="openModal(coffee)"
                          class="btn btn-xs btn-info"
                        >
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
      </div>

      <!-- Sidebar for Adding New Coffee Bean -->
      <div class="drawer-side">
        <label
          for="coffee-bean-drawer"
          aria-label="close sidebar"
          class="drawer-overlay"
        ></label>
        <div class="menu p-4 w-80 bg-base-200 text-base-content min-h-full">
          <div class="container mx-auto px-6">
            <h2 class="text-2xl font-bold mb-6">Add New Coffee Bean</h2>
            <form @submit.prevent="saveCoffeeBean" class="space-y-4">
              <!-- Region -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Region</span>
                </label>
                <select
                  id="region-select"
                  v-model="bean.region_origin_id"
                  class="select select-bordered w-full"
                  required
                >
                  <option disabled selected>Select a region...</option>
                  <option
                    v-for="region in regionOriginData"
                    :key="region.id"
                    :value="region.id"
                  >
                    {{ region.region_origin }} - Elevation:
                    {{ region.elevation }}
                  </option>
                </select>
              </div>

              <!-- Variety -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Variety</span>
                </label>
                <select
                  id="child-select"
                  v-model="bean.variety_id"
                  class="select select-bordered w-full"
                  required
                >
                  <option disabled selected>Select a variety...</option>
                  <option
                    v-for="variety in varietyData"
                    :key="variety.id"
                    :value="variety.id"
                  >
                    {{ variety.parent.type }} - {{ variety.child.type }}
                  </option>
                </select>
              </div>

              <!-- Process -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Process</span>
                </label>
                <select
                  id="process-select"
                  v-model="bean.process_id"
                  class="select select-bordered w-full"
                  required
                >
                  <option disabled selected>Select a process...</option>
                  <option
                    v-for="process in processData"
                    :key="process.id"
                    :value="process.id"
                  >
                    {{ process.process }}
                  </option>
                </select>
              </div>

              <!-- Submit Button -->
              <button type="submit" class="btn btn-primary w-full">
                Add Coffee Bean
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Indicator -->
    <Loading :loading="loading" />

    <!-- Modal for View Details -->
    <teleport to="body">
      <dialog id="coffeeBeanModal" class="modal" :open="modalOpen">
        <div class="modal-box bg-base-100">
          <!-- Header with Order Status -->
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-bold text-2xl text-primary flex items-center">
              <Icon name="mdi:file-edit" class="mx-2" />
              Coffee Bean Details
            </h3>
            <!-- <div
              class="badge badge-lg"
              :class="{
                'badge-success': selectedCoffee?.status === 3,
                'badge-warning': selectedCoffee?.status === 1,
                'badge-info': selectedCoffee?.status === 2,
                'badge-error': selectedCoffee?.status === 4,
              }"
            >
              {{ getStatusDescription(selectedCoffee?.status).toUpperCase() }}
            </div> -->
          </div>

          <!-- Coffee Bean Information -->
          <div class="gap-6 mb-6">
            <div class="bg-base-200 p-4 rounded-lg">
              <h4
                class="font-semibold text-lg text-secondary mb-3 flex items-center"
              >
                <Icon name="mdi:information-slab-circle" class="mx-2" />
                Coffee Bean Information
              </h4>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-base-content/70">Region:</span>
                  <span class="font-medium text-primary">{{
                    selectedCoffee?.coffee_region_origin?.region_origin
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-base-content/70">Country:</span>
                  <span class="font-medium">{{
                    selectedCoffee?.coffee_region_origin.coffee_country_origin
                      .country_origin
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-base-content/70">Parent Variety:</span>
                  <span class="font-medium">{{
                    selectedCoffee?.coffee_variety_relationship.parent.type
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-base-content/70">Child Variety:</span>
                  <span class="font-medium">{{
                    selectedCoffee?.coffee_variety_relationship.child.type
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-base-content/70">Process:</span>
                  <span class="font-medium">{{
                    selectedCoffee?.coffee_process.process
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Action -->
          <div class="modal-action mt-6">
            <form method="dialog" class="flex gap-3">
              <button @click="editCoffee" class="btn btn-warning">Edit</button>
              <button @click="deleteCoffee" class="btn btn-error">
                Delete
              </button>
              <button @click="closeModal" class="btn btn-primary">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </teleport>
  </div>
</template>

<script setup>
const { $supabaseClient, $supabaseData } = useNuxtApp();
const bean = ref({
  region_origin_id: null,
  variety_id: null,
  process_id: null,
});

// Modal state
const modalOpen = ref(false);
const selectedCoffee = ref(null);

const countryOriginData = ref([]);
const regionOriginData = ref([]);
const varietyData = ref([]);
const processData = ref([]);
const loading = ref(true);
const coffeeBean = ref([]);

// Fetch initial data on mount
onMounted(async () => {
  coffeeBean.value = await $supabaseData.fetchCoffeeBeans();
  countryOriginData.value = await $supabaseData.fetchCoffeeCountryOrigin();
  regionOriginData.value = await $supabaseData.fetchCoffeeRegionOrigin();
  varietyData.value = await $supabaseData.fetchCoffeeVariety();
  processData.value = await $supabaseData.fetchCoffeeProcess();
});

// Watch for changes in coffeeBean
watchEffect(() => {
  if (coffeeBean.value) loading.value = false;
});

const saveCoffeeBean = async () => {
  let beanObj = {
    region_id: bean.value.region_origin_id,
    coffee_variety_id: bean.value.variety_id,
    process_id: bean.value.process_id,
  };

  try {
    const { data, error } = await $supabaseClient
      .from("coffee_bean")
      .insert(beanObj)
      .select();

    if (error) {
      throw new Error(`Failed to add new coffee bean: ${error.message}`);
    }

    if (data) {
      useNuxtApp().$toast.success("New coffee bean added successfully");
      document.getElementById("coffee-bean-drawer").checked = false;
      // Refresh the coffeeBean list
      coffeeBean.value = await $supabaseData.fetchCoffeeBeans();
    }
  } catch (error) {
    console.error(
      error.message || "An error occurred while adding a new coffee bean."
    );
    useNuxtApp().$toast.error(
      error.message || "Failed to add new coffee bean."
    );
  }
};

const openModal = (coffee) => {
  selectedCoffee.value = coffee;
  modalOpen.value = true;
};

const closeModal = () => {
  selectedCoffee.value = null;
  modalOpen.value = false;
};

const editCoffee = (coffee) => {
  console.log("Edit Coffee:", coffee);
  // Implement your edit logic here
  closeModal();
};

const deleteCoffee = async (coffee) => {
  try {
    const { error } = await $supabaseClient
      .from("coffee_bean")
      .delete()
      .eq("id", coffee.id);

    if (error) {
      throw new Error(`Failed to delete coffee bean: ${error.message}`);
    }

    useNuxtApp().$toast.success("Coffee bean deleted successfully");
    // Refresh the coffeeBean list
    coffeeBean.value = await $supabaseData.fetchCoffeeBeans();
  } catch (error) {
    console.error(
      error.message || "An error occurred while deleting a coffee bean."
    );
    useNuxtApp().$toast.error(error.message || "Failed to delete coffee bean.");
  }
};

const formatLakPrice = (price) => {
  return `LAK ${price.toLocaleString()}`;
};
</script>
