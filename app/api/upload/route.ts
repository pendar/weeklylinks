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

    // Upload to Vercel Blob with unique filename to prevent conflicts
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    console.log('Upload successful:', blob.url)

    return NextResponse.json({ 
      url: blob.url,
      success: true 
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorName = error instanceof Error ? error.name : 'UnknownError'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    console.error('Upload error details:', {
      message: errorMessage,
      stack: errorStack,
      name: errorName,
      fullError: error
    })
    
    return NextResponse.json(
      { 
        error: 'Upload failed: ' + errorMessage,
        details: errorName 
      }, 
      { status: 500 }
    )
  }
}
