// plugins/supabase-data.ts
export default defineNuxtPlugin(async (nuxtApp) => {
  const { $supabaseClient } = useNuxtApp();
  const supabase = useSupabase();

  // Centralized data fetching methods
  const dataService = {
    // Orders with detailed nested relationships
    async fetchOrders(options = {}) {
      const { limit = 10, ascending = false } = options;

      const { data: ordersData, error } = await supabase
        .from("orders_beans")
        .select(
          `
            *,
            customer:customers(*),
            shipping_information(*),
            order_status_history!order_status_history_order_id_fkey(*),
            order_items(
              *,
              roast_coffee_level(*),
              roast_beans(name,
                coffee_bean(
                  coffee_process(process),
                  coffee_region_origin(region_origin),
                  coffee_variety_relationship(
                    parent:coffee_variety_parent_id(type),
                    child:coffee_variety_child_id(type)
                  )
                )
              )
            )
          `
        )
        .order("order_date", { ascending })
        .limit(limit);

      if (error) {
        console.error("Error fetching orders:", error);
        return null;
      }

      return ordersData;
    },

    // Customers fetching
    async fetchCustomers(options = {}) {
      const { limit = 10, columns = "*, shipping_information(*)" } = options;

      const { data: customers, error } = await supabase
        .from("customers")
        .select(columns);

      if (error) {
        console.error("Error fetching customers:", error);
        return null;
      }

      return customers;
    },

    // Customers fetching
    async fetchCoffeeBeans(options = {}) {
      const {
        columns = "*",
        select = `
            id,
            coffee_region_origin(region_origin,
                coffee_country_origin(country_origin)
            ),
            coffee_variety_relationship(
                parent:coffee_variety_parent_id(type),
                child:coffee_variety_child_id(type)
            ),
            coffee_process(process)
        `,
      } = options;

      const { data: coffee_bean, error } = await supabase
        .from("coffee_bean")
        .select(select);

      if (error) {
        console.error("Error fetching Coffee Beans:", error);
        return null;
      }

      return coffee_bean;
    },

    // Country Origin fetching
    async fetchCoffeeCountryOrigin(options = {}) {
      const { columns = "*" } = options;

      const { data: coffee_country_origin, error } = await supabase
        .from("coffee_country_origin")
        .select(columns);

      if (error) {
        console.error("Error fetching Coffee Country Origin:", error);
        return null;
      }

      return coffee_country_origin;
    },

    // Country Origin fetching
    async fetchCoffeeCountryOrigin(options = {}) {
      const { columns = "*" } = options;

      const { data: coffee_country_origin, error } = await supabase
        .from("coffee_country_origin")
        .select(columns);

      if (error) {
        console.error("Error fetching Coffee Country Origin:", error);
        return null;
      }

      return coffee_country_origin;
    },
    // Region Origin fetching
    async fetchCoffeeRegionOrigin(options = {}) {
      const { columns = "*" } = options;

      const { data: coffee_region_origin, error } = await supabase
        .from("coffee_region_origin")
        .select(columns);

      if (error) {
        console.error("Error fetching Coffee Region Origin:", error);
        return null;
      }

      return coffee_region_origin;
    },

    // Coffee Variety fetching
    async fetchCoffeeVariety(options = {}) {
      const { columns = "*" } = options;

      const { data: coffee_bean_variety, error } = await supabase
        .from("coffee_variety_relationship")
        .select(`id, parent:coffee_variety_parent_id(type),
                child:coffee_variety_child_id(type)`);

      if (error) {
        console.error("Error fetching Coffee Variety:", error);
        return null;
      }

      return coffee_bean_variety;
    },

    // Coffee Process fetching
    async fetchCoffeeProcess(options = {}) {
      const { columns = "*" } = options;
      const { data: coffee_process, error } = await supabase
        .from("coffee_process")
        .select(columns);

      if (error) {
        console.error("Error fetching Coffee Process:", error);
        return null;
      }

      return coffee_process;
    },

    // Generic method for flexible data fetching
    async fetchData(table, options = {}) {
      const { select = "*", order = null, filters = [] } = options;

      let query = supabase.from(table).select(select).limit(limit);

      // Apply ordering if specified
      if (order) {
        query = query.order(order.column, {
          ascending: order.ascending || false,
        });
      }

      // Apply filters
      filters.forEach((filter) => {
        query = query.filter(filter.column, filter.operator, filter.value);
      });

      const { data, error } = await query;

      if (error) {
        console.error(`Error fetching ${table}:`, error);
        return null;
      }

      return data;
    },

    async fetchRemainingOrders(options = {}) {
      const { limit = 10, ascending = false } = options;
      const statuses = [1, 3];

      const promises = statuses.map(async (status) => {
        try {
          const { count, error } = await supabase
            .from("orders_beans")
            .select("*", { count: "exact" })
            .eq("status", status);

          if (error) {
            console.error(`Error fetching count for status ${status}:`, error);
            return { [status]: 0 };
          } else {
            return { [status]: count || 0 };
          }
        } catch (err) {
          console.error(
            `Unexpected error while fetching orders for status ${status}:`,
            err
          );
          return { [status]: 0 };
        }
      });

      const results = await Promise.all(promises);

      // Combine all results into a single object with individual counts
      const statusCounts = results.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
      );

      // Calculate the total count by summing up all individual counts
      const totalCounts = Object.values(statusCounts).reduce(
        (acc, count) => acc + count,
        0
      );

      // Return an object containing both statusCounts and totalCounts
      return { statusCounts, totalCounts };
    },
  };

  // Inject the service into the Nuxt app
  return {
    provide: {
      supabaseData: dataService,
      supabaseClient: supabase,
    },
  };
});
