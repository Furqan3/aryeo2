import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const listingId = params.id

  if (!listingId) {
    return NextResponse.json({ error: 'Listing ID is required' }, { status: 400 })
  }

  try {
    const apiUrl = `https://api.aryeo.com/v1/listings/${listingId}`
    const searchParams = new URLSearchParams({ include: 'images' })

    const response = await fetch(`${apiUrl}?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.ARYEO_API_KEY}`,
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch listing: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Aryeo API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listing data' },
      { status: 500 }
    )
  }
}
