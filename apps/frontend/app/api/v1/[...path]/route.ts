import { NextRequest, NextResponse } from 'next/server';

// Backend URL (internal Docker network in prod, localhost in dev)
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

/**
 * Proxy all /api/v1/* requests to the backend
 * This allows the backend to remain internal (not publicly exposed)
 */
async function proxyRequest(request: NextRequest, path: string[]) {
  const targetPath = `/api/v1/${path.join('/')}`;
  const targetUrl = new URL(targetPath, BACKEND_URL);

  // Forward query parameters
  request.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  // Prepare headers (forward relevant ones)
  const headers = new Headers();
  const forwardHeaders = ['content-type', 'accept', 'user-agent'];
  forwardHeaders.forEach((header) => {
    const value = request.headers.get(header);
    if (value) headers.set(header, value);
  });

  // Build fetch options
  const fetchOptions: RequestInit = {
    method: request.method,
    headers,
  };

  // Forward body for POST/PUT/PATCH
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    fetchOptions.body = await request.text();
  }

  try {
    const response = await fetch(targetUrl.toString(), fetchOptions);

    // Get response body
    const contentType = response.headers.get('content-type') || '';

    // Handle binary responses (images)
    if (contentType.startsWith('image/')) {
      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        status: response.status,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': response.headers.get('cache-control') || 'public, max-age=31536000, immutable',
        },
      });
    }

    // Handle JSON/text responses
    const body = await response.text();
    return new NextResponse(body, {
      status: response.status,
      headers: {
        'Content-Type': contentType || 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Backend unavailable' },
      { status: 502 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path);
}
