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

export async function getListing(url: string): Promise<any> {
  const listingId = extractListingId(url)

  if (!listingId) {
    throw new Error('Invalid Aryeo listing URL')
  }

  const response = await fetch(`/api/aryeo/listings/${listingId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || `Failed to fetch listing: ${response.status}`)
  }

  return response.json()
}
