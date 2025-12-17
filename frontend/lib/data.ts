// Extract listing ID from Aryeo URL
function extractListingId(url: string): string | null {
  try {
    const parts = url.split('/')
    const listingsIndex = parts.findIndex(part => part === 'listings')
    if (listingsIndex !== -1 && parts[listingsIndex + 1]) {
      return parts[listingsIndex + 1]
    }
    return null
  } catch (err) {
    return null
  }
}

// Store listing data to localStorage for later use
function storeData(data: any) {
  try {
    localStorage.setItem('current-listing', JSON.stringify(data))
  } catch (err) {
    console.error('Failed to store listing data:', err)
  }
}

// Extract and format property info from API data
export function extractPropertyInfo(data: any) {
  const address = data.address || {}
  const building = data.building || {}
  const price = data.price || {}
  const lot = data.lot || {}

  return {
    price: price.list_price_formatted || "",
    bedrooms: building.bedrooms_number?.toString() || building.bedrooms?.toString() || "",
    bathrooms: building.bathrooms?.toString() || "",
    square_feet: building.square_feet?.toString() || "",
    address: address.unparsed_address_part_one ||
             `${address.street_number || ""} ${address.street_name || ""}`.trim() || "",
    city: address.city || "",
    state: address.state_or_province || "",
    zip_code: address.postal_code || "",
    property_type: data.sub_type === "SINGLE_FAMILY_RESIDENCE" ? "Single Family Home" :
                   data.sub_type === "CONDO" ? "Condo" :
                   data.sub_type === "TOWNHOUSE" ? "Townhouse" :
                   "Single Family Home",
    year_built: building.year_built?.toString() || "",
    lot_size: lot.size_acres ? `${lot.size_acres} acres` : "",
  }
}

// Fetch listing data from Aryeo API
export async function getListing(url: string): Promise<any> {
  const listingId = extractListingId(url)

  if (!listingId) {
    throw new Error('Invalid Aryeo listing URL')
  }

  const myurl = `https://api.aryeo.com/v1/listings/${listingId}`

  const params = new URLSearchParams({
    include: 'images',
  })

  const resp = await fetch(`${myurl}?${params.toString()}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer 144207|MUG7v0HsQYZb7rqyGapWn0HVF1POuQRV155qasPm`,
      Accept: 'application/json',
    },
  })

  if (!resp.ok) {
    throw new Error(`Failed to fetch listing: ${resp.status}`)
  }

  const data = await resp.json()
  storeData(data.data)

  return data
}
