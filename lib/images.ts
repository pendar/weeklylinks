import path from 'node:path'
import fs from 'node:fs/promises'
import sharp from 'sharp'

export interface SaveImageResult {
  url: string
  blurDataUrl: string
}

export async function saveUploadToPublic(file: File): Promise<SaveImageResult> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  await fs.mkdir(uploadsDir, { recursive: true })

  const ext = path.extname(file.name) || '.jpg'
  const base = `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const filename = `${base}${ext}`
  const fullPath = path.join(uploadsDir, filename)
  await fs.writeFile(fullPath, buffer)

  // Create a tiny blur placeholder
  const blur = await sharp(buffer).resize(24).toBuffer()
  const blurDataUrl = `data:image/jpeg;base64,${blur.toString('base64')}`

  const url = `/uploads/${filename}`
  return { url, blurDataUrl }
}



