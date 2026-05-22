import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL ?? 'http://api:4000';

async function proxy(request: NextRequest, params: { path: string[] }) {
  const base = API_URL.replace(/\/$/, '');
  const path = params.path?.join('/') ?? '';
  const url = new URL(request.url);
  const target = `${base}/${path}${url.search}`;

  const contentType = request.headers.get('content-type') ?? 'application/json';
  const forwardedFor = request.headers.get('x-forwarded-for');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  const headers = new Headers({ 'content-type': contentType });
  if (forwardedFor) headers.set('x-forwarded-for', forwardedFor);
  if (cfConnectingIp) headers.set('cf-connecting-ip', cfConnectingIp);

  const method = request.method.toUpperCase();
  const body = method === 'GET' || method === 'HEAD' ? undefined : await request.text();

  const apiResponse = await fetch(target, {
    method,
    headers,
    body,
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

export async function GET(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const params = await ctx.params;
  return proxy(request, params);
}

export async function POST(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const params = await ctx.params;
  return proxy(request, params);
}

export async function PUT(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const params = await ctx.params;
  return proxy(request, params);
}

export async function PATCH(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const params = await ctx.params;
  return proxy(request, params);
}

export async function DELETE(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const params = await ctx.params;
  return proxy(request, params);
}
