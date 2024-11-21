// composables/useLakPrice.ts
export const useLakPrice = () => {
    /**
     * Format price in Laotian Kip
     * @param price - Number to be formatted
     * @returns Formatted price string with LAK suffix
     */
    const formatLakPrice = (price?: number | string | null): string => {
      // Ensure the price is a number
      const numPrice = Number(price)
      
      // Check if the price is a valid number
      if (isNaN(numPrice)) return '0 LAK'
      
      // Use toLocaleString to add thousand separators
      return `${numPrice.toLocaleString('en-US')} LAK`
    }
  
    /**
     * Calculate total from an array of items with a price property
     * @param items - Array of items with a price property
     * @param priceKey - Optional key to specify which property to sum (defaults to 'price')
     * @returns Formatted total price in LAK
     */
    const calculateTotalLakPrice = (
      items?: Array<Record<string, any>>, 
      priceKey: string = 'price'
    ): string => {
      if (!items || items.length === 0) return '0 LAK'
  
      const total = items.reduce((sum, item) => {
        const itemPrice = Number(item[priceKey])
        return sum + (isNaN(itemPrice) ? 0 : itemPrice)
      }, 0)
  
      return formatLakPrice(total)
    }
  
    return {
      formatLakPrice,
      calculateTotalLakPrice
    }
  }