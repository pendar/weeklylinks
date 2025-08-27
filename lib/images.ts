import sharp from 'sharp'

export interface SaveImageResult {
  url: string
  blurDataUrl: string
}

// For local development, fall back to local storage
export async function saveUploadToPublic(file: File): Promise<SaveImageResult> {
  // In production, this should be handled by UploadThing
  // This is just a fallback for local development
  
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Create a tiny blur placeholder
  const blur = await sharp(buffer).resize(24).toBuffer()
  const blurDataUrl = `data:image/jpeg;base64,${blur.toString('base64')}`

  // For production, the URL will come from UploadThing
  // For dev, we'll use a placeholder
  const url = `/api/placeholder-image`
  return { url, blurDataUrl }
}



