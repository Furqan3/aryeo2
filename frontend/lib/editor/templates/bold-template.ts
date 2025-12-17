import { createImageFrame, generateUniqueId, bringTextToFront } from '../canvas-helpers'

interface PropertyInfo {
  price?: string
  property_type?: string
  city?: string
  state?: string
  bedrooms?: string | number
  bathrooms?: string | number
  square_feet?: string | number
}

export const applyBoldTemplate = async (
  canvas: any,
  fabricLib: any,
  images: string[],
  propertyInfo: PropertyInfo,
  canvasSize: { width: number; height: number },
  saveToHistory: (canvas: any) => void
) => {
  if (!canvas) return

  canvas.clear()
  canvas.setBackgroundColor('#0a0a0a', canvas.renderAll.bind(canvas))

  const { width, height } = canvasSize
  const heroHeight = 680
  const PADDING = 60

  // 1. Hero Image
  await createImageFrame(canvas, fabricLib, images[0] || '', 0, 0, width, heroHeight, { cornerRadius: 0 })

  // 2. Dramatic Gradient Overlay
  const overlay = new fabricLib.Rect({
    left: 0,
    top: 0,
    width: width,
    height: heroHeight,
    fill: new fabricLib.Gradient({
      type: 'linear',
      coords: { x1: 0, y1: 0, x2: 0, y2: heroHeight },
      colorStops: [
        { offset: 0, color: 'rgba(0,0,0,0.15)' },
        { offset: 0.6, color: 'rgba(0,0,0,0.55)' },
        { offset: 1, color: 'rgba(0,0,0,0.92)' },
      ],
    }),
    selectable: true,
    evented: true,
    id: generateUniqueId(),
  })
  canvas.add(overlay)

  // 3. EXCLUSIVE Badge (Bold Red - Fully Editable)
  const badge = new fabricLib.Rect({
    left: PADDING,
    top: PADDING,
    width: 240,
    height: 70,
    rx: 12,
    ry: 12,
    fill: '#dc2626',
    selectable: true,
    evented: true,
    shadow: '0 8px 20px rgba(0,0,0,0.4)',
    id: generateUniqueId(),
  })
  canvas.add(badge)

  const badgeText = new fabricLib.Textbox('EXCLUSIVE', {
    left: PADDING + 30,
    top: PADDING + 15,
    fontSize: 32,
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    fontWeight: 900,
    fill: '#ffffff',
    selectable: true,
    evented: true,
    editable: true,
    letterSpacing: 6,
    id: generateUniqueId(),
  })
  canvas.add(badgeText)

  // 4. Property Type Title - Huge & Dramatic
  const propertyType = (propertyInfo?.property_type || 'Single Family Home').toUpperCase()
  const titleLines = propertyType.replace(/ /g, '\n') // Vertical stacking

  const title = new fabricLib.Textbox(titleLines, {
    left: PADDING,
    top: 320,
    fontSize: 88,
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    fontWeight: 900,
    fill: '#ffffff',
    selectable: true,
    evented: true,
    editable: true,
    width: width * 0.6,
    lineHeight: 0.95,
    textAlign: 'left',
    shadow: new fabricLib.Shadow({
      color: 'rgba(0,0,0,0.7)',
      blur: 30,
      offsetX: 0,
      offsetY: 8,
    }),
    id: generateUniqueId(),
  })
  canvas.add(title)

  // 5. Price - Bold Amber/Gold
  const priceValue = propertyInfo?.price || '$1,250,000'

  const price = new fabricLib.Textbox(priceValue, {
    left: PADDING,
    top: heroHeight - 100,
    fontSize: 64,
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    fontWeight: 900,
    fill: '#fbbf24',
    selectable: true,
    evented: true,
    editable: true,
    shadow: '0 4px 15px rgba(0,0,0,0.5)',
    id: generateUniqueId(),
  })
  canvas.add(price)

  // Gold accent line under price
  const priceLine = new fabricLib.Rect({
    left: PADDING,
    top: heroHeight - 20,
    width: 160,
    height: 8,
    fill: '#fbbf24',
    rx: 4,
    ry: 4,
    selectable: true,
    evented: true,
    id: generateUniqueId(),
  })
  canvas.add(priceLine)

  // 6. Bottom Supporting Images (Side by Side)
  const bottomTop = heroHeight + 30
  const bottomImgWidth = (width - 90) / 2
  const bottomImgHeight = height - bottomTop - 110

  await createImageFrame(
    canvas,
    fabricLib,
    images[1] || images[0],
    30,
    bottomTop,
    bottomImgWidth,
    bottomImgHeight,
    { cornerRadius: 20 }
  )

  await createImageFrame(
    canvas,
    fabricLib,
    images[2] || images[0],
    30 + bottomImgWidth + 30,
    bottomTop,
    bottomImgWidth,
    bottomImgHeight,
    { cornerRadius: 20 }
  )

  // 7. Bottom Info Bar (Dark, Elegant)
  const infoBarHeight = 100
  const infoBar = new fabricLib.Rect({
    left: 0,
    top: height - infoBarHeight,
    width: width,
    height: infoBarHeight,
    fill: '#111111',
    selectable: true,
    evented: true,
    id: generateUniqueId(),
  })
  canvas.add(infoBar)

  // 8. Property Details
  const beds = propertyInfo?.bedrooms || '4'
  const baths = propertyInfo?.bathrooms || '3'
  const sqft = propertyInfo?.square_feet ? Number(propertyInfo.square_feet).toLocaleString() : '2,800'

  const detailsText = `${beds} Beds  •  ${baths} Baths  •  ${sqft} Sq Ft`

  const details = new fabricLib.Textbox(detailsText, {
    left: PADDING,
    top: height - 70,
    fontSize: 28,
    fontFamily: "'Inter', Arial, sans-serif",
    fontWeight: 600,
    fill: '#e5e7eb',
    selectable: true,
    evented: true,
    editable: true,
    letterSpacing: 2,
    id: generateUniqueId(),
  })
  canvas.add(details)

  // 9. Location
  const locationText = propertyInfo ? `${propertyInfo.city}, ${propertyInfo.state}` : 'Los Angeles, CA'

  const location = new fabricLib.Textbox(locationText.toUpperCase(), {
    left: width - PADDING - 400,
    top: height - 70,
    fontSize: 28,
    fontFamily: "'Inter', Arial, sans-serif",
    fontWeight: 500,
    fill: '#9ca3af',
    selectable: true,
    evented: true,
    editable: true,
    width: 400,
    textAlign: 'right',
    letterSpacing: 3,
    id: generateUniqueId(),
  })
  canvas.add(location)

  // Final render & save
  setTimeout(() => {
    bringTextToFront(canvas)
    saveToHistory(canvas)
  }, 400)
}