import { NextResponse } from 'next/server';

const DISCORD_WEBHOOK_URL =
  'https://discord.com/api/webhooks/REDACTED';

export async function POST(request: Request) {
  let body: { event?: string; url?: string; timestamp?: string } = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0]?.trim() ?? 'unknown';

  let country = 'unknown';

  if (ip !== 'unknown' && ip !== '127.0.0.1' && ip !== '::1') {
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        const data = (await response.json()) as { country_name?: string };
        country = data.country_name ?? 'unknown';
      }
    } catch {
      country = 'unknown';
    }
  }

  const entry = {
    event: body.event ?? 'unknown',
    url: body.url ?? 'unknown',
    timestamp: body.timestamp ?? new Date().toISOString(),
    ip,
    country,
  };

  console.log('Tracked event:', entry);

  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: `Website event: ${entry.event}\nIP: ${entry.ip}\nCountry: ${entry.country}\nTime: ${entry.timestamp}`,
      }),
    });
  } catch {
    console.error('Failed to send Discord webhook notification');
  }

  return NextResponse.json({ ok: true });
}
