// plugins/supabase-data.ts
export default defineNuxtPlugin(async (nuxtApp) => {
    const supabase = useSupabase()
  
    // Centralized data fetching methods
    const dataService = {
      // Orders with detailed nested relationships
      async fetchOrders(options = {}) {
        const { 
          limit = 10, 
          ascending = false 
        } = options
  
        const { data: ordersData, error } = await supabase
          .from('orders_beans')
          .select(`
            *,
            customer:customers(*),
            shipping_information(*),
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
          `)
          .order('order_date', { ascending })
          .limit(limit)
  
        if (error) {
          console.error('Error fetching orders:', error)
          return null
        }
  
        return ordersData
      },
  
      // Customers fetching
      async fetchCustomers(options = {}) {
        const { 
          limit = 10, 
          columns = '*' 
        } = options
  
        const { data: customers, error } = await supabase
          .from('customers')
          .select(columns)
          .limit(limit)
  
        if (error) {
          console.error('Error fetching customers:', error)
          return null
        }
  
        return customers
      },
  
      // Generic method for flexible data fetching
      async fetchData(table, options = {}) {
        const { 
          select = '*', 
          limit = 10, 
          order = null,
          filters = []
        } = options
  
        let query = supabase
          .from(table)
          .select(select)
          .limit(limit)
  
        // Apply ordering if specified
        if (order) {
          query = query.order(order.column, { 
            ascending: order.ascending || false 
          })
        }
  
        // Apply filters
        filters.forEach(filter => {
          query = query.filter(filter.column, filter.operator, filter.value)
        })
  
        const { data, error } = await query
  
        if (error) {
          console.error(`Error fetching ${table}:`, error)
          return null
        }
  
        return data
      }
    }
  
    // Inject the service into the Nuxt app
    return {
      provide: {
        supabaseData: dataService
      }
    }
  })