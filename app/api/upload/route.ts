import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('Uploading file:', {
      name: file.name,
      size: file.size,
      type: file.type
    })

    // Upload to Vercel Blob (token is automatically picked up from env)
    const blob = await put(file.name, file, {
      access: 'public',
    })

    console.log('Upload successful:', blob.url)

    return NextResponse.json({ 
      url: blob.url,
      success: true 
    })
  } catch (error) {
    console.error('Upload error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    return NextResponse.json(
      { 
        error: 'Upload failed: ' + error.message,
        details: error.name 
      }, 
      { status: 500 }
    )
  }
}
