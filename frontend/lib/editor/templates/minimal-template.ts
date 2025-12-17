import { createImageFrame, generateUniqueId, bringTextToFront } from '../canvas-helpers'

interface PropertyInfo {
  price?: string
  property_type?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  bedrooms?: string | number
  bathrooms?: string | number
  square_feet?: string | number
  year_built?: string | number
}

export const applyMinimalTemplate = async (
  canvas: any,
  fabricLib: any,
  images: string[],
  propertyInfo: PropertyInfo,
  canvasSize: { width: number; height: number },
  saveToHistory: (canvas: any) => void
) => {
  if (!canvas) return

  canvas.clear()

  const { width, height } = canvasSize

  // 1. Full-width hero image
  await createImageFrame(canvas, fabricLib, images[0] || '', 0, 0, width, height, { objectFit: 'cover' })

  // 2. Dark gradient overlay for maximum text readability
  const overlayGradient = new fabricLib.Gradient({
    type: 'linear',
    coords: { x1: 0, y1: 0, x2: 0, y2: height },
    colorStops: [
      { offset: 0, color: 'rgba(0, 0, 0, 0.4)' },
      { offset: 0.7, color: 'rgba(0, 0, 0, 0.6)' },
      { offset: 1, color: 'rgba(0, 0, 0, 0.85)' },
    ],
  })

  const overlay = new fabricLib.Rect({
    left: 0,
    top: 0,
    width: width,
    height: height,
    fill: overlayGradient,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(overlay)

  const PADDING = 60
  const GOLD = '#D4AF37'
  const WHITE = '#FFFFFF'

  // 3. Price - Huge and bold
  const priceText = new fabricLib.Textbox(propertyInfo?.price || '$2,450,000', {
    left: PADDING,
    top: height * 0.45,
    fontSize: 80,
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    fontWeight: 900,
    fill: WHITE,
    selectable: true,
    editable: true,
    width: width - PADDING * 2,
    textAlign: 'left',
    lineHeight: 1,
    shadow: '0 4px 12px rgba(0,0,0,0.4)',
    id: generateUniqueId(),
  })
  canvas.add(priceText)

  // 4. Gold accent line under price
  const accentLine = new fabricLib.Rect({
    left: PADDING,
    top: height * 0.45 + 100,
    width: 120,
    height: 6,
    fill: GOLD,
    rx: 3,
    ry: 3,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(accentLine)

  // 5. Property type badge (luxury pill)
  const typeValue = (propertyInfo?.property_type || 'Luxury Estate').toUpperCase()

  const typeText = new fabricLib.Textbox(typeValue, {
    left: PADDING,
    top: height * 0.45 + 120,
    fontSize: 20,
    fontFamily: "'Inter', Arial, sans-serif",
    fontWeight: 700,
    fill: GOLD,
    selectable: true,
    editable: true,
    width: width / 2,
    letterSpacing: 3,
    id: generateUniqueId(),
  })
  canvas.add(typeText)

  // 6. Address - Clear and prominent
  const fullAddress = propertyInfo
    ? `${propertyInfo.address || '789 Sunset Boulevard'}\n${propertyInfo.city || 'Beverly Hills'}, ${propertyInfo.state || 'CA'} ${propertyInfo.zip_code || '90210'}`
    : '789 Sunset Boulevard\nBeverly Hills, CA 90210'

  const addressText = new fabricLib.Textbox(fullAddress, {
    left: PADDING,
    top: height * 0.45 + 170,
    fontSize: 36,
    fontFamily: "'Inter', Arial, sans-serif",
    fontWeight: 600,
    fill: WHITE,
    selectable: true,
    editable: true,
    width: width - PADDING * 2,
    lineHeight: 1.3,
    shadow: '0 2px 8px rgba(0,0,0,0.3)',
    id: generateUniqueId(),
  })
  canvas.add(addressText)

  // 7. Property specs - Large and spaced
  const beds = propertyInfo?.bedrooms || '5'
  const baths = propertyInfo?.bathrooms || '4.5'
  const sqft = propertyInfo?.square_feet ? Number(propertyInfo.square_feet).toLocaleString() : '3,800'
  const year = propertyInfo?.year_built ? `• ${propertyInfo.year_built}` : '• 2022'

  const specsText = new fabricLib.Textbox(`${beds} BED  •  ${baths} BATH  •  ${sqft} SQ FT${year}`, {
    left: PADDING,
    top: height * 0.45 + 280,
    fontSize: 28,
    fontFamily: "'Inter', Arial, sans-serif",
    fontWeight: 500,
    fill: '#EEEEEE',
    selectable: true,
    editable: true,
    width: width - PADDING * 2,
    letterSpacing: 2,
    id: generateUniqueId(),
  })
  canvas.add(specsText)

  // 8. Bottom image strip (4 small images)
  const stripHeight = 180
  const imgCount = 4
  const imgWidth = (width - PADDING * 2 - 30) / imgCount  // 10px gaps * 3
  const stripY = height - stripHeight - 40

  const smallImages = [
    images[1] || images[0],
    images[2] || images[0],
    images[3] || images[0],
    images[4] || images[0],
  ]

  for (let i = 0; i < imgCount; i++) {
    await createImageFrame(
      canvas,
      fabricLib,
      smallImages[i],
      PADDING + i * (imgWidth + 10),
      stripY,
      imgWidth,
      stripHeight,
      { cornerRadius: 16 }
    )
  }

  // Final render
  setTimeout(() => {
    bringTextToFront(canvas)
    saveToHistory(canvas)
  }, 500)
}