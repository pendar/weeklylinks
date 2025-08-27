import { NextResponse } from 'next/server'

export async function GET() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  
  return NextResponse.json({
    hasToken: !!token,
    tokenLength: token?.length || 0,
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('BLOB')),
    totalEnvKeys: Object.keys(process.env).length,
    timestamp: new Date().toISOString()
  })
}
