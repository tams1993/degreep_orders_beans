<template>
  <div class="container mx-auto px-4 py-6">
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
              >
                + Add New Coffee Bean</label
              >
            </div>

            <div class="">
              <table class="table table-zebra">
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
                  <tr v-for="coffee in coffeeBean" :key="coffee.id" :class="{}">
                    <td>
                      {{
                        coffee.coffee_region_origin.coffee_country_origin
                          .country_origin
                      }}
                    </td>
                    <td>
                      {{ coffee.coffee_region_origin.region_origin }}
                    </td>
                    <td>
                      {{ coffee.coffee_variety_relationship.parent.type }}
                    </td>
                    <td>
                      {{ coffee.coffee_variety_relationship.child.type }}
                    </td>
                    <td>
                      {{ coffee.coffee_process.process }}
                    </td>
                    <td>
                      <div class="flex space-x-2">
                        <button @click="" class="btn btn-xs btn-info">
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
      <div class="drawer-side">
        <label
          for="coffee-bean-drawer"
          aria-label="close sidebar"
          class="drawer-overlay"
        ></label>
        <div class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          <div class="container mx-auto p-6">
            <h2 class="text-2xl font-bold mb-6">Add New Coffee Bean</h2>
            <form @submit.prevent="saveCoffeeBean" class="space-y-6">
              <div class="form-control">
                <label class="label" for="region">
                  <span class="label-text">Region</span>
                </label>
                <select
                  id="region-select"
                  v-model="bean.region_origin_id"
                  class="select select-bordered"
                  required
                >
                  <option
                    v-for="region in regionOriginData"
                    :key="region.id"
                    :value="region.id"
                  >
                    {{ region.region_origin }} - Elavation:
                    {{ region.elevation }}
                  </option>
                </select>
              </div>

              <div class="form-control">
                <label class="label" for="variety">
                  <span class="label-text">Variety</span>
                </label>
                <select
                  id="child-select"
                  v-model="bean.variety_id"
                  class="select select-bordered"
                  required
                >
                  <option
                    v-for="variety in varietyData"
                    :key="variety.id"
                    :value="variety.id"
                  >
                    {{ variety.parent.type }} - {{ variety.child.type }}
                  </option>
                </select>
              </div>
              <div class="form-control">
                <div class="label">
                  <span class="label-text">Process</span>
                </div>
                <select
                  id="process-select"
                  v-model="bean.process_id"
                  class="select select-bordered"
                  required
                >
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
            {{ bean }}
          </div>
        </div>
      </div>
      <Loading :loading="loading" />
    </div>
  </div>
</template>

<script setup>
const { $supabaseClient, $supabaseData } = useNuxtApp();
const bean = ref({
  region_origin_id: null,
  variety_id: null,
  process_id: null,
});

const countryOriginData = ref([]);
const regionOriginData = ref([]);
const varietyData = ref([]);
const processData = ref([]);
const loading = ref(true);
const coffeeBean = ref();

const coffeeBeansChanel = $supabaseClient
  .channel("coffee-bean-channel")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "coffee_bean" },
    async (payload) => {
      coffeeBean.value = await $supabaseData.fetchCoffeeBeans();
      useNuxtApp().$toast.success("Coffee Bean have been updated");
    }
  )
  .subscribe();

onMounted(async () => {
  coffeeBean.value = await $supabaseData.fetchCoffeeBeans();
  countryOriginData.value = await $supabaseData.fetchCoffeeCountryOrigin();
  regionOriginData.value = await $supabaseData.fetchCoffeeRegionOrigin();
  varietyData.value = await $supabaseData.fetchCoffeeVariety();
  processData.value = await $supabaseData.fetchCoffeeProcess();
});

watchEffect(() => {
  if (coffeeBean.value) loading.value = false;
});

onUnmounted(() => {
  if (coffeeBeansChanel) {
    coffeeBeansChanel.unsubscribe();
  }
});

const saveCoffeeBean = async () => {
  let beanObj = {
    region_id: bean.value.region_origin_id,
    coffee_variety_id: bean.value.variety_id,
    process_id: bean.value.process_id,
  };

  loading.value = true;

  try {
    const { data, error } = await $supabaseClient
      .from("coffee_bean")
      .insert(beanObj)
      .select();

    if (error) {
      throw new Error(`Failed to add new coffee bean: ${error}`);
    }

    if (data) {
      useNuxtApp().$toast.success("New coffee bean add success");
      document.getElementById("coffee-bean-drawer").checked = false;
      loading.value = false;
    }
  } catch (error) {
    loading.value = false;
    useNuxtApp().$toast.error(
      error.message || "An error occurred while updating roast bean."
    );
  }
};
</script>
