import { createImageFrame, generateUniqueId } from '../canvas-helpers'

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
}

export const applyRealEstateTemplate = async (
  canvas: any,
  fabricLib: any,
  images: string[],
  propertyInfo: PropertyInfo,
  canvasSize: { width: number; height: number }
) => {
  if (!canvas) return

  canvas.clear()

  const { width, height } = canvasSize

  // Design constants - Modern Luxury
  const WHITE = '#FFFFFF'
  const GOLD = '#D4AF37'
  const DARK_OVERLAY = 'rgba(0, 0, 0, 0.65)'
  const PADDING = 60
  const GAP = 20

  // Layout
  const LEFT_WIDTH = width * 0.65
  const RIGHT_WIDTH = width - LEFT_WIDTH - GAP
  const SMALL_IMG_HEIGHT = (height - GAP * 2 - 100) / 3  // Slightly taller for better view

  // 1. Full background hero image
  await createImageFrame(canvas, fabricLib, images[0] || '', 0, 0, width, height, { cornerRadius: 0 })

  // 2. Dark gradient overlay for text readability
  const overlay = new fabricLib.Rect({
    left: 0,
    top: 0,
    width: width,
    height: height,
    fill: DARK_OVERLAY,
    selectable: true,
    evented: true,
    id: generateUniqueId(),
  })
  canvas.add(overlay)

  // 3. Three small images on the right (with rounded corners)
  await createImageFrame(canvas, fabricLib, images[1] || '', LEFT_WIDTH + GAP, 50, RIGHT_WIDTH, SMALL_IMG_HEIGHT, { cornerRadius: 24 })
  await createImageFrame(
    canvas,
    fabricLib,
    images[2] || '',
    LEFT_WIDTH + GAP,
    50 + SMALL_IMG_HEIGHT + GAP,
    RIGHT_WIDTH,
    SMALL_IMG_HEIGHT,
    { cornerRadius: 24 }
  )
  await createImageFrame(
    canvas,
    fabricLib,
    images[3] || '',
    LEFT_WIDTH + GAP,
    50 + SMALL_IMG_HEIGHT * 2 + GAP * 2,
    RIGHT_WIDTH,
    SMALL_IMG_HEIGHT,
    { cornerRadius: 24 }
  )

  // 4. Modern Price Badge (pill-shaped, editable)
  const priceValue = propertyInfo?.price || '$1,250,000'

  const priceBg = new fabricLib.Rect({
    left: PADDING,
    top: PADDING,
    rx: 32,
    ry: 32,
    width: 500,
    height: 100,
    fill: 'rgba(0, 0, 0, 0.6)',
    stroke: GOLD,
    strokeWidth: 4,
    selectable: true,
    evented: true,
    shadow: '0 8px 24px rgba(0,0,0,0.5)',
    id: generateUniqueId(),
  })

  const priceText = new fabricLib.Textbox(priceValue, {
    left: PADDING + 30,
    top: PADDING + 20,
    fontSize: 56,
    fontWeight: 900,
    fill: WHITE,
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    selectable: true,
    evented: true,
    editable: true,
    width: 440,
    id: generateUniqueId(),
  })

  canvas.add(priceBg, priceText)

  // 5. Property Type Tag (gold luxury feel)
  const typeText = new fabricLib.Textbox((propertyInfo?.property_type || 'Luxury Villa').toUpperCase(), {
    left: PADDING,
    top: PADDING + 120,
    fontSize: 24,
    fontWeight: 700,
    fill: GOLD,
    fontFamily: "'Inter', Arial, sans-serif",
    selectable: true,
    evented: true,
    editable: true,
    letterSpacing: 4,
    width: 500,
    id: generateUniqueId(),
  })
  canvas.add(typeText)

  // 6. Address & Details (bottom overlay area - modern footer style)
  const footerY = height - 280

  // Semi-transparent footer band
  const footerBand = new fabricLib.Rect({
    left: 0,
    top: footerY,
    width: width,
    height: 280,
    fill: 'rgba(0, 0, 0, 0.5)',
    selectable: true,
    evented: true,
    id: generateUniqueId(),
  })
  canvas.add(footerBand)

  // Gold accent line
  const accentLine = new fabricLib.Rect({
    left: PADDING,
    top: footerY + 10,
    width: width - PADDING * 2,
    height: 5,
    fill: GOLD,
    rx: 2,
    ry: 2,
    selectable: true,
    evented: true,
    id: generateUniqueId(),
  })
  canvas.add(accentLine)

  // Address
  const address = propertyInfo?.address || '123 Ocean Drive'
  const cityLine = propertyInfo
    ? `${propertyInfo.city}, ${propertyInfo.state} ${propertyInfo.zip_code}`
    : 'Miami Beach, FL 33139'

  const addressText = new fabricLib.Textbox(`${address}\n${cityLine}`, {
    left: PADDING,
    top: footerY + 40,
    fontSize: 36,
    fontWeight: 600,
    fill: WHITE,
    fontFamily: "'Inter', Arial, sans-serif",
    selectable: true,
    evented: true,
    editable: true,
    width: width * 0.5,
    lineHeight: 1.3,
    shadow: '0 2px 8px rgba(0,0,0,0.4)',
    id: generateUniqueId(),
  })
  canvas.add(addressText)

  // Details
  const beds = propertyInfo?.bedrooms || '4'
  const baths = propertyInfo?.bathrooms || '3'
  const sqft = propertyInfo?.square_feet ? Number(propertyInfo.square_feet).toLocaleString() : '2,800'

  const detailsText = new fabricLib.Textbox(`${beds} BEDROOMS  ${baths} BATHROOMS  ${sqft} SQ FT`, {
    left: width - PADDING - 600,
    top: footerY + 80,
    fontSize: 30,
    fontWeight: 500,
    fill: '#E0E0E0',
    fontFamily: "'Inter', Arial, sans-serif",
    selectable: true,
    evented: true,
    editable: true,
    width: 600,
    textAlign: 'right',
    letterSpacing: 3,
    id: generateUniqueId(),
  })
  canvas.add(detailsText)

  // Bring all text and editable elements to front
  setTimeout(() => {
    canvas.getObjects().forEach((obj: any) => {
      if (obj.type === 'textbox' || obj.type === 'rect' || obj.type === 'text') {
        canvas.bringToFront(obj)
      }
    })
    canvas.renderAll()
  }, 400)
}