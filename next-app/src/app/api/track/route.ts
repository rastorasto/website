import { NextResponse } from 'next/server';

const API_URL = process.env.API_URL ?? 'http://api:4000';

export async function POST(request: Request) {
  const base = API_URL.replace(/\/$/, '');
  const url = `${base}/track`;

  const bodyText = await request.text();
  const contentType = request.headers.get('content-type') ?? 'application/json';
  const forwardedFor = request.headers.get('x-forwarded-for');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  const headers = new Headers({ 'content-type': contentType });
  if (forwardedFor) headers.set('x-forwarded-for', forwardedFor);
  if (cfConnectingIp) headers.set('cf-connecting-ip', cfConnectingIp);

  const apiResponse = await fetch(url, {
    method: 'POST',
    headers,
    body: bodyText,
  });

  const responseText = await apiResponse.text();
  const responseContentType = apiResponse.headers.get('content-type') ?? 'application/json';

  return new NextResponse(responseText, {
    status: apiResponse.status,
    headers: {
      'Content-Type': responseContentType,
    },
  });
}
