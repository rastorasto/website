import { NextResponse } from 'next/server';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

export async function POST(request: Request) {
  let body: { event?: string; url?: string; timestamp?: string } = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  // Check for Cloudflare's real client IP first, then fall back to x-forwarded-for
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = cfConnectingIp?.trim() ?? forwardedFor?.split(',')[0]?.trim() ?? 'unknown';

  let country = 'unknown';

  let city = 'unknown';
  let region = 'unknown';
  let countryCode = 'unknown';

  if (ip !== 'unknown' && ip !== '127.0.0.1' && ip !== '::1') {
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        const data = (await response.json()) as {
          country_name?: string;
          city?: string;
          region?: string;
          country_code?: string;
        };
        country = data.country_name ?? 'unknown';
        city = data.city ?? 'unknown';
        region = data.region ?? 'unknown';
        countryCode = data.country_code ?? 'unknown';
        console.log('Geolocation data:', data);
      } else {
        console.log('Geolocation API response not OK:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Geolocation lookup error:', error);
    }
  }

  const entry = {
    event: body.event ?? 'unknown',
    url: body.url ?? 'unknown',
    timestamp: body.timestamp ?? new Date().toISOString(),
    ip,
    country,
    city,
    region,
    countryCode,
  };

  console.log('Tracked event:', entry);

  if (DISCORD_WEBHOOK_URL) {
    try {
      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `Website event: ${entry.event}\nIP: ${entry.ip}\nLocation: ${entry.city}, ${entry.region}, ${entry.countryCode}\nCountry: ${entry.country}\nTime: ${entry.timestamp}`,
        }),
      });
    } catch {
      console.error('Failed to send Discord webhook notification');
    }
  }

  return NextResponse.json({ ok: true });
}
