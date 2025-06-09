<template>
  <div class="container mx-auto p-6">
    <div class="drawer drawer-end">
      <input id="roast-beans-drawer" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content">
        <!-- Page content here -->

        Need to add update logic and update package size database. also add
        package size available. add coffee beans process
        <div>
          <div class="flex my-4">
            <h2 class="text-2xl font-bold mb-6 flex-1">Roast Beans</h2>
            <label
              for="roast-beans-drawer"
              class="btn btn-primary drawer-button"
            >
              + Add new Roast beans</label
            >
          </div>

          <!-- Grid Display -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            v-if="roastBeansData"
          >
            <!-- Card for each bean -->
            <!-- <div v-for="bean in roastBeansData" :key="bean.id" class="card bg-secondary shadow-md">
                            <div class="card-body">
                                <h3 class="card-title text-xl font-bold">{{ bean.name }}</h3>
                                <p class="text-gray-500 mb-4">{{ bean.description }}</p>
                                <div class="flex items-center justify-between">
                                    <span class="font-semibold">Bag size:</span>
                                    <span class="text-primary font-bold">
                                        {{ bean.roast_beans_packages[0].packages_size?.quantity }}
                                        {{ bean.roast_beans_packages[0].packages_size?.units.unit_symbol }}

                                    </span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="font-semibold">Price:</span>
                                    <span class="text-primary font-bold">{{
                                        formatLakPrice(bean.roast_beans_packages[0].price) }}</span>
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
                                    <button @click="deleteBean(bean)" class="btn btn-sm btn-error">Delete</button>
                                </div>
                            </div>
                        </div> -->
            <div
              v-for="bean in roastBeansData"
              :key="bean.id"
              class="bg-secondary shadow-md rounded-lg mb-4 flex flex-col flex-1"
            >
              <div class="flex-1 card-body p-4 flex flex-col justify-between">
                <!-- Card Content (top section) -->
                <div>
                  <h3 class="card-title text-xl font-bold mb-2">
                    {{ bean.name }}
                  </h3>
                  <p class="text-gray-500 mb-4">
                    {{ bean.description }}
                  </p>

                  <!-- Availability -->
                  <div class="flex justify-between items-center mb-4">
                    <span class="font-semibold">Available:</span>
                    <span
                      :class="
                        bean.available
                          ? 'text-green-500 font-bold'
                          : 'text-red-500 font-bold'
                      "
                    >
                      {{ bean.available ? "Yes" : "No" }}
                    </span>
                  </div>

                  <!-- Bag Sizes -->
                  <div class="mb-4">
                    <span class="font-semibold block mb-2">Bag sizes:</span>
                    <div
                      v-if="bean.roast_beans_packages.length > 0"
                      class="space-y-2"
                    >
                      <div
                        v-for="(
                          packageSize, index
                        ) in bean.roast_beans_packages"
                        :key="index"
                        class="flex justify-between items-center py-1 border-b border-gray-300 last:border-0"
                      >
                        <span class="text-primary font-bold">
                          {{ packageSize.packages_size?.quantity }}
                          {{ packageSize.packages_size?.units?.unit_symbol }}
                        </span>
                        <span class="text-primary font-semibold">
                          {{ formatLakPrice(packageSize.price) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Actions (bottom section) -->
                <div class="flex justify-end space-x-2">
                  <button @click="editBean(bean)" class="btn btn-sm btn-info">
                    Edit
                  </button>
                  <button
                    @click="deleteBean(bean)"
                    class="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Add/Edit Bean Modal -->
          <!-- <dialog id="beanModal" class="modal">
            <form method="dialog" class="modal-box">
              <h3 class="font-bold text-lg mb-4">
                {{ isEditing ? "Edit Bean" : "Add New Bean" }}
              </h3>

              {{ currentBean.roast_beans_packages }}

              <div class="form-control mb-4">
                <label class="label" for="name">
                  <span class="label-text">Name</span>
                </label>
                <input
                  v-model="currentBean.name"
                  id="name"
                  type="text"
                  placeholder="Bean Name"
                  class="input input-bordered"
                />
              </div>

              <div class="form-control mb-4">
                <label class="label" for="description">
                  <span class="label-text">Description</span>
                </label>
                <textarea
                  v-model="currentBean.description"
                  id="description"
                  placeholder="Bean Description"
                  class="textarea textarea-bordered"
                ></textarea>
              </div>

              <div class="form-control">
                <label class="label" for="coffee_bean">
                  <span class="label-text">Coffee bean</span>
                </label>
                <span
                  >{{
                    currentBean.coffee_bean?.coffee_region_origin.region_origin
                  }}
                  {{
                    currentBean.coffee_bean?.coffee_variety_relationship.parent
                      .type
                  }}
                  {{
                    currentBean.coffee_bean?.coffee_variety_relationship.child
                      .type
                  }}
                  {{ currentBean.coffee_bean?.coffee_process.process }}</span
                >

                <input
                  type="text"
                  class="textarea textarea-bordered"
                  disabled
                  :value="`${currentBean.coffee_bean?.coffee_region_origin.region_origin} ${currentBean.coffee_bean?.coffee_variety_relationship.parent.type} ${currentBean.coffee_bean?.coffee_variety_relationship.child.type} ${currentBean.coffee_bean?.coffee_process.process}`"
                />
              </div>

              <div class="form-control mb-4">
                <label class="label" for="price">
                  <span class="label-text">Bag size</span>
                </label>
                <div class="flex" v-if="currentBean.roast_beans_packages">
                  <input
                    v-model="
                      currentBean.roast_beans_packages[0].packages_size.quantity
                    "
                    id="bag_size"
                    type="number"
                    placeholder="Bag size"
                    disabled
                    class="input input-bordered flex-1"
                  />
                  <label class="label" for="price">
                    <span class="label-text"
                      >{{
                        currentBean.roast_beans_packages[0].packages_size.units
                          .unit_name
                      }}
                      ({{
                        currentBean.roast_beans_packages[0].packages_size.units
                          .unit_symbol
                      }})</span
                    >
                  </label>
                </div>
              </div>

              <div
                class="form-control mb-4"
                v-if="currentBean.roast_beans_packages"
              >
                <label class="label" for="price">
                  <span class="label-text">Price</span>
                </label>
                <input
                  v-model="currentBean.roast_beans_packages[0].price"
                  id="price"
                  type="number"
                  placeholder="Price per kg"
                  class="input input-bordered"
                />
              </div>

              <div class="form-control mb-4">
                <label class="label cursor-pointer">
                  <span class="label-text">Available</span>
                  <input
                    v-model="currentBean.available"
                    type="checkbox"
                    class="toggle"
                  />
                </label>
              </div>

              <div class="modal-action">
                <button @click="saveBean" class="btn btn-primary">
                  {{ isEditing ? "Update" : "Add" }}
                </button>
                <button type="button" class="btn" @click="closeModal">
                  Cancel
                </button>
              </div>
            </form>
          </dialog> -->

          <dialog id="beanModal" class="modal">
            <form method="dialog" class="modal-box">
              <h3 class="font-bold text-lg mb-4">
                {{ isEditing ? "Edit Bean" : "Add New Bean" }}
              </h3>

              <div class="form-control mb-4">
                <label class="label" for="name">
                  <span class="label-text">Name</span>
                </label>
                <input
                  v-model="currentBean.name"
                  id="name"
                  type="text"
                  placeholder="Bean Name"
                  class="input input-bordered"
                />
              </div>

              <div class="form-control mb-4">
                <label class="label" for="description">
                  <span class="label-text">Description</span>
                </label>
                <textarea
                  v-model="currentBean.description"
                  id="description"
                  placeholder="Bean Description"
                  class="textarea textarea-bordered"
                ></textarea>
              </div>

              <div class="form-control mb-4">
                <label class="label" for="coffee_bean">
                  <span class="label-text">Coffee Bean</span>
                </label>
                <input
                  type="text"
                  class="textarea textarea-bordered"
                  disabled
                  :value="`${currentBean.coffee_bean?.coffee_region_origin.region_origin} ${currentBean.coffee_bean?.coffee_variety_relationship.parent.type} ${currentBean.coffee_bean?.coffee_variety_relationship.child.type} ${currentBean.coffee_bean?.coffee_process.process}`"
                />
              </div>

              <!-- Package Size and Price Inputs -->
              <label class="label">
                <span class="label-text">Package Size</span>
              </label>
              <div class="space-y-4 border border-gray-300 rounded-lg p-4">
                <div
                  v-for="(
                    packageSize, index
                  ) in currentBean.roast_beans_packages"
                  :key="index"
                  class="flex flex-col gap-2 border-b border-gray-300 p-4 last:border-b-0"
                >
                  <!-- Package Size Selection -->
                  <label class="label">
                    <span class="label-text">Size</span>
                  </label>
                  <select
                    v-model="packageSize.packages_size.id"
                    class="select select-bordered w-full"
                    disabled
                  >
                    <option
                      v-for="size in packages_size"
                      :key="size.id"
                      :value="size.id"
                    >
                      {{ size.quantity }} {{ size.units?.unit_symbol }}
                    </option>
                  </select>

                  <!-- Current Price and New Price Inputs -->
                  <div class="flex items-center justify-between gap-4">
                    <div class="flex-1">
                      <label class="label">
                        <span class="label-text">Current Price</span>
                      </label>
                      <div class="relative">
                        <div
                          class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                        >
                          <span class="text-gray-500 text-sm font-medium"
                            >₭</span
                          >
                        </div>
                        <input
                          type="text"
                          placeholder="0"
                          class="input input-bordered w-full pr-8 text-gray-600"
                          :value="
                            packageSize.price
                              ? packageSize.price.toLocaleString('lo-LA')
                              : ''
                          "
                          readonly
                        />
                      </div>
                    </div>

                    <div class="flex-1">
                      <label class="label">
                        <span class="label-text"
                          >New Price <span class="text-red-500">*</span></span
                        >
                      </label>
                      <div class="relative">
                        <div
                          class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                        >
                          <span class="text-gray-500 text-sm font-medium"
                            >₭</span
                          >
                        </div>
                        <input
                          type="text"
                          placeholder="0"
                          class="input input-bordered w-full pr-8 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                          :value="formatDisplayValue(packageSize.newPrice)"
                          @input="handleNumberInput($event, packageSize)"
                          @blur="handleBlur($event, packageSize)"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Price Comparison -->
                  <div
                    v-if="
                      packageSize.price &&
                      packageSize.newPrice &&
                      !isNaN(packageSize.newPrice)
                    "
                    class="mt-2 p-3 bg-secondary-content rounded-md border border-gray-200"
                  >
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-gray-600 font-medium"
                        >Price Change:</span
                      >
                      <div class="text-right">
                        <div
                          :class="[
                            'font-semibold',
                            packageSize.newPrice < packageSize.price
                              ? 'text-red-600'
                              : packageSize.newPrice > packageSize.price
                              ? 'text-green-600'
                              : 'text-gray-600',
                          ]"
                        >
                          {{
                            packageSize.newPrice > packageSize.price
                              ? "+"
                              : packageSize.newPrice < packageSize.price
                              ? ""
                              : "±"
                          }}{{
                            Math.abs(
                              packageSize.newPrice - packageSize.price
                            ).toLocaleString("lo-LA")
                          }}₭
                        </div>
                        <div class="text-xs text-gray-500">
                          {{
                            packageSize.price > 0
                              ? (
                                  ((packageSize.newPrice - packageSize.price) /
                                    packageSize.price) *
                                  100
                                ).toFixed(1) + "%"
                              : ""
                          }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-control my-4">
                <button
                  @click="addNewPackage"
                  class="btn btn-secondary text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add New Package
                </button>
              </div>

              <div class="form-control mb-4">
                <label class="label cursor-pointer">
                  <span class="label-text">Available</span>
                  <input
                    v-model="currentBean.available"
                    type="checkbox"
                    class="toggle"
                  />
                </label>
              </div>

              <div class="modal-action">
                <button @click="saveBean" class="btn btn-primary">
                  {{ isEditing ? "Update" : "Add" }}
                </button>
                <button type="button" class="btn" @click="closeModal">
                  Cancel
                </button>
              </div>
            </form>
          </dialog>

          <!-- Deleting confirmation Modal -->
          <dialog id="deletingModal" class="modal" v-if="currentBean">
            <form method="dialog" class="modal-box">
              <h3 class="font-bold text-lg mb-4">Are you sure?</h3>
              <span></span>

              <span
                >Do you want to delete
                {{
                  currentBean.coffee_bean?.coffee_region_origin.region_origin
                }}
                {{
                  currentBean.coffee_bean?.coffee_variety_relationship.parent
                    .type
                }}
                {{
                  currentBean.coffee_bean?.coffee_variety_relationship.child
                    .type
                }}
                {{ currentBean.coffee_bean?.coffee_process.process }}
                {{
                  currentBean.roast_beans_packages
                    ? currentBean.roast_beans_packages[0]?.packages_size
                        .quantity
                    : 0
                }}
                {{
                  currentBean.roast_beans_packages
                    ? currentBean.roast_beans_packages[0]?.packages_size.units
                        .unit_name
                    : ""
                }}?</span
              >

              <div class="modal-action">
                <button @click="deleteBeanConfirm" class="btn btn-primary">
                  Delete
                </button>
                <button type="button" class="btn" @click="closeDeleteModal">
                  Cancel
                </button>
              </div>
            </form>
          </dialog>
        </div>
      </div>
      <div class="drawer-side">
        <label
          for="roast-beans-drawer"
          aria-label="close sidebar"
          class="drawer-overlay"
        ></label>
        <div class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          <div class="container mx-auto p-6">
            <h2 class="text-2xl font-bold mb-6">Add New Roast Bean</h2>
            <form @submit.prevent="addRoastBean" class="space-y-6">
              <!-- Name -->
              <div class="form-control">
                <label class="label" for="name">
                  <span class="label-text">Bean Name</span>
                </label>
                <input
                  v-model="newBean.name"
                  id="name"
                  type="text"
                  placeholder="Enter bean name"
                  class="input input-bordered"
                  required
                />
              </div>

              <!-- Description -->
              <div class="form-control">
                <label class="label" for="description">
                  <span class="label-text">Description</span>
                </label>
                <textarea
                  v-model="newBean.description"
                  id="description"
                  placeholder="Enter description"
                  class="textarea textarea-bordered"
                ></textarea>
              </div>

              <div class="label">
                <span class="label-text">Choose a quantity</span>
              </div>
              <select
                id="quantitySelect"
                class="select select-bordered w-full max-w-xs"
                required
                v-model="newBean.bag_size.id"
              >
                <option
                  v-for="option in packages_size"
                  :key="option.id"
                  :value="option.id"
                >
                  {{ option.quantity }} {{ option.units.unit_symbol }}
                </option>
              </select>

              <!-- Price per kg -->
              <div class="form-control">
                <label class="label" for="price">
                  <span class="label-text">Price LAK</span>
                </label>
                <input
                  v-model="newBean.bag_size.price"
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="Enter price"
                  class="input input-bordered"
                  required
                />
              </div>
              <div class="label">
                <span class="label-text">Choose a coffee</span>
              </div>
              <select
                id="coffee-select"
                v-model="newBean.coffee_bean_id"
                class="select select-bordered"
                required
              >
                <option
                  v-for="coffee in coffee_bean"
                  :key="coffee.id"
                  :value="coffee.id"
                >
                  {{ coffee.coffee_region_origin.region_origin }} -
                  {{ coffee.coffee_process.process }} -
                  {{ coffee.coffee_variety_relationship.child.type }}
                </option>
              </select>

              <!-- Availability -->
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Available</span>
                  <input
                    v-model="newBean.available"
                    type="checkbox"
                    class="toggle"
                  />
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
    <Loading :loading="loading" />
  </div>
</template>

<script setup>
const { $supabaseClient } = useNuxtApp();
const { formatLakPrice, calculateTotalLakPrice } = useLakPrice();
const roastBeansData = ref([]);
const currentBean = ref({
  id: null,
  name: "",
  description: "",
  available: false,
  coffee_bean_id: null,
  roast_beans_packages: [], // Array of packages
});
const newBean = ref({
  name: "",
  description: "",
  bag_size: {
    price: 0,
    id: null,
  },
  available: false,
  coffee_bean_id: null,
});

const loading = ref(false);

onMounted(() => {
    loading.value = true
})

watchEffect(() => {
  if (roastBeansData.value) {
    loading.value = false;
  }
});

const { data: packages_size } = await $supabaseClient.from("packages_size")
  .select(`
            id,
            quantity,
            units(
                    unit_name,
                    unit_symbol
                )
          `);

const { data: coffee_bean } = await $supabaseClient.from("coffee_bean").select(`
            id,
            coffee_region_origin(region_origin,
                coffee_country_origin(country_origin)
            ),
            coffee_variety_relationship(
                    parent:coffee_variety_parent_id(type),
                    child:coffee_variety_child_id(type)
                  ),
            coffee_process(process)
          `);

const fetchBeansList = async () => {
  const { data: roast_beans } = await $supabaseClient.from("roast_beans")
    .select(`
            *,
            roast_beans_packages(
                id, price, packages_size(
                    id,
                    quantity,
                    units(
                        unit_name,
                        unit_symbol
                        )
                    )
                ),
            coffee_bean( coffee_region_origin(region_origin,
                coffee_country_origin(country_origin)
            ),
            coffee_variety_relationship(
                    parent:coffee_variety_parent_id(type),
                    child:coffee_variety_child_id(type)
                  ),
            coffee_process(process))

          `);

  roastBeansData.value = roast_beans;
};

onMounted(() => {
  fetchBeansList();
});

const isEditing = ref(false);
const isDeleting = ref(false);

const editBean = (bean) => {
  isEditing.value = true;
  currentBean.value = {
    ...bean,
    roast_beans_packages: [...bean.roast_beans_packages], // Deep copy
  };
  document.getElementById("beanModal").showModal();
};

const saveBean = async () => {
  const updateRoastBeanObj = {
    name: currentBean.value.name,
    description: currentBean.value.description,
    available: currentBean.value.available,
    id: currentBean.value.id,
  };

  const updateRoastBeanPackageObj = {
    id: currentBean.value.roast_bean_package_id,
    price: currentBean.value.roast_beans_packages[0].price,
  };

  try {
    const { data, error: updateRoastBeanError } = await $supabaseClient
      .from("roast_beans")
      .update(updateRoastBeanObj)
      .eq("id", updateRoastBeanObj.id)
      .select();

    if (updateRoastBeanError) {
      throw new Error(`Failed to update roast bean: ${updateRoastBeanError}`);
    }

    const { data: roastBeansPackage, error: updateRoastBeanPackageError } =
      await $supabaseClient
        .from("roast_beans_packages")
        .update(updateRoastBeanPackageObj)
        .eq("id", updateRoastBeanPackageObj.id)
        .select();

    if (updateRoastBeanPackageError) {
      throw new Error(
        `Failed to update roast bean package: ${updateRoastBeanPackageError}`
      );
    }
    if (data && roastBeansPackage) {
      closeModal();
      useNuxtApp().$toast.success("roast bean has been updated");
      fetchBeansList();
    }
  } catch (error) {
    loading.value = false;
    useNuxtApp().$toast.error(
      error.message || "An error occurred while updating roast bean."
    );
  }
};

const deleteBean = (bean) => {
  isDeleting.value = true;
  currentBean.value = { ...bean };
  document.getElementById("deletingModal").showModal();
};

const deleteBeanConfirm = async () => {
  loading.value = true;
  try {
    const { error: deleteRoastBeans } = await $supabaseClient
      .from("roast_beans")
      .delete()
      .eq("id", currentBean.value.id);

    if (deleteRoastBeans) {
      console.log(deleteRoastBeans);

      throw new Error(`Failed to delete roast bean: ${deleteRoastBeans}`);
    }

    const { error: deleteRoastBeanPackage } = await $supabaseClient
      .from("roast_beans_packages")
      .delete()
      .eq("id", currentBean.value.roast_bean_package_id);

    if (deleteRoastBeanPackage) {
      console.log(deleteRoastBeanPackage);

      throw new Error(
        `Failed to delete roast bean package: ${deleteRoastBeanPackage}`
      );
    }

    // If both operations are successful, show a success message
    useNuxtApp().$toast.success("roast bean has been created");
    fetchBeansList();
    loading.value = false;
  } catch (error) {
    loading.value = false;
    useNuxtApp().$toast.error(
      error.message || "An error occurred while deleting roast bean."
    );
  }
};

const closeModal = () => {
  document.getElementById("beanModal").close();
};

const closeDeleteModal = () => {
  document.getElementById("deletingModal").close();
};

const addRoastBean = async () => {
  loading.value = true;
  try {
    // Insert the new roast bean package size into the 'roast_bean_packages' table
    const { data: roastBeansPackage, error: roastBeanPackageError } =
      await $supabaseClient
        .from("roast_beans_packages")
        .insert([
          {
            price: newBean.value.bag_size.price,
            packages_size_id: newBean.value.bag_size.id,
          },
        ])
        .select();

    if (roastBeanPackageError) {
      console.log(roastBeanPackageError);

      throw new Error(
        `Failed to create roast bean package: ${roastBeanPackageError}`
      );
    }

    const roastBeanPackageID = roastBeansPackage[0].id;

    // Insert the new roast bean into the 'roast_beans' table
    const { data: roastBeans, error: roastBeansError } = await $supabaseClient
      .from("roast_beans")
      .insert([
        {
          name: newBean.value.name,
          description: newBean.value.description,
          coffee_bean_id: newBean.value.coffee_bean_id,
          available: newBean.value.available,
          roast_bean_package_id: roastBeanPackageID,
        },
      ])
      .select();

    if (roastBeansError) {
      throw new Error(
        `Failed to create roast bean: ${roastBeansError.message}`
      );
    }

    // If both operations are successful, show a success message
    useNuxtApp().$toast.success("roast bean has been created");
    fetchBeansList();
    resetBeanForm();
    document.getElementById("roast-beans-drawer").checked = false;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    useNuxtApp().$toast.error(
      error.message || "An error occurred while creating roast bean."
    );
  }
};

const resetBeanForm = () => {
  newBean.value = {
    name: "",
    description: "",
    bag_size: {
      price: 0,
      id: null,
    },
    available: false,
    coffee_bean_id: null,
  };
};

const getPriceForSize = (sizeId, packages_size) => {
  console.log(packages_size);
  const size = packages_size.find((s) => s.id === sizeId);
  return size ? size.price : "";
};
const addNewPackage = () => {
  currentBean.roast_beans_packages.push({
    packages_size_id: null,
    price: null,
  });
};

const formatDisplayValue = (value) => {
  if (!value || value === "" || isNaN(value)) return "";
  return parseInt(value).toLocaleString("lo-LA");
};

const handleNumberInput = (event, packageSize) => {
  let value = event.target.value;

  // Remove all non-numeric characters except for the cursor position
  const numericValue = value.replace(/[^\d]/g, "");

  // Update the actual numeric value
  packageSize.newPrice = numericValue ? parseInt(numericValue) : null;

  // Format and update the display value
  if (numericValue) {
    const formattedValue = parseInt(numericValue).toLocaleString("lo-LA");
    event.target.value = formattedValue;
  } else {
    event.target.value = "";
  }
};

const handleBlur = (event, packageSize) => {
  // Ensure the display value is properly formatted when leaving the field
  if (packageSize.newPrice) {
    event.target.value = parseInt(packageSize.newPrice).toLocaleString("lo-LA");
  }
};
</script>
