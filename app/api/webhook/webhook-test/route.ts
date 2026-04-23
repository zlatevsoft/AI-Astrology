import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    status: 'Webhook test endpoint is working',
    timestamp: new Date().toISOString(),
    message: 'This endpoint is accessible'
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.text()
    
    return NextResponse.json({ 
      status: 'POST request received',
      timestamp: new Date().toISOString(),
      bodyLength: body.length,
      message: 'Webhook endpoint can receive POST requests'
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to process request',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
