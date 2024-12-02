<!-- layouts/default.vue -->
<template>
  <div>
    <header v-if="user">
      <nav class="  px-4 sm:px-6 lg:px-8">
        <div class="navbar bg-base-100">

          <!-- Navigation Links -->
          <div class=" flex-1">
            <ul class="menu menu-horizontal px-1">
              <li>
                <NuxtLink to="/dashboard" class="flex items-center gap-2">
                  <Icon name="material-symbols:dashboard" class="mx-2" size="2em" />
                  Dashboard
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/create" class="flex items-center gap-2">
                  <Icon name="material-symbols:add-shopping-cart" class="mx-2" size="2em" />
                  Orders
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/customer" class="flex items-center gap-2">
                  <Icon name="material-symbols:person" class="mx-2" size="2em" />
                  Customer
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/roast_beans" class="flex items-center gap-2">
                  <Icon name="icon-park-outline:ad-product" class="mx-2" size="2em" />
                  Roast beans
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/promotion" class="flex items-center gap-2">
                  <Icon name="lsicon:badge-promotion-filled" class="mx-2" size="2em" />
                  Promotion
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/todo" class="flex items-center gap-2">
                  <Icon name="pajamas:todo-done" class="mx-2" size="2em" />
                  TODO
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- User Dropdown -->
          <div class=" flex-none">
            <div class="dropdown dropdown-end">
              <label tabindex="0" class="btn btn-ghost">
                <span>{{ user.email }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2"><path d="m6 9 6 6 6-6"/></svg>
              </label>
              <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <button @click="handleSignOut" class="text-error">
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>

const { signOut } = useAuth()
const user = useSupabaseUser()
const showDropdown = ref(false)

async function handleSignOut() {
  const router = useRouter()

  await signOut()
  router.go(0)
}
</script>