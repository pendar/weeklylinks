import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Check if we have the blob token
    const token = process.env.BLOB_READ_WRITE_TOKEN
    
    if (!token) {
      console.error('BLOB_READ_WRITE_TOKEN environment variable not found')
      return NextResponse.json({ 
        error: 'Blob storage not configured. Please check Vercel dashboard.' 
      }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Upload to Vercel Blob with explicit token
    const blob = await put(file.name, file, {
      access: 'public',
      token: token,
    })

    return NextResponse.json({ 
      url: blob.url,
      success: true 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' }, 
      { status: 500 }
    )
  }
}
