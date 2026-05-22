'use client';
import TerminalPanel from '@/components/TerminalPanel';

function GithubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 0C5.37 0 0 5.51 0 12.33c0 5.46 3.44 10.08 8.2 11.73.6.12.82-.27.82-.58v-2.17c-3.33.74-4.03-1.64-4.03-1.64-.54-1.41-1.31-1.79-1.31-1.79-1.07-.76.08-.75.08-.75 1.18.09 1.8 1.25 1.8 1.25 1.05 1.86 2.76 1.32 3.43 1 .11-.79.42-1.33.76-1.64-2.66-.31-5.47-1.36-5.47-6.06 0-1.34.46-2.43 1.23-3.29-.12-.31-.53-1.55.12-3.23 0 0 1-.33 3.3 1.26a11.04 11.04 0 0 1 6 0c2.3-1.59 3.3-1.26 3.3-1.26.65 1.68.24 2.92.12 3.23.77.86 1.23 1.95 1.23 3.29 0 4.71-2.81 5.74-5.49 6.04.43.38.82 1.12.82 2.26v3.35c0 .31.22.7.83.58C20.56 22.41 24 17.79 24 12.33 24 5.51 18.63 0 12 0z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4 stroke-current">
      <rect x="2.5" y="5" width="19" height="14" rx="2.25" strokeWidth="1.8" />
      <path d="M4 7.5 12 13l8-5.5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  const handleGitHubClick = () => {
    const entry = {
      event: 'github_click',
      url: 'https://github.com/rastorasto',
      timestamp: new Date().toISOString(),
    };

    const apiBase = process.env.API_URL ?? '';
    const endpoint = apiBase ? `${apiBase.replace(/\/$/, '')}/track` : '/api/track';

    try {
      navigator.sendBeacon(
        endpoint,
        new Blob([JSON.stringify(entry)], { type: 'application/json' })
      );
    } catch (e) {
      void fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
        keepalive: true,
      });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black px-4 py-6 text-white">
      <div className="absolute inset-0 z-0">
        <TerminalPanel />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col gap-10 lg:ml-auto lg:w-1/2 lg:items-center">
        <div className="flex w-full flex-1 flex-col items-center gap-16">
          <div className="text-4xl font-bold text-white">meow meow :3</div>

          <div className="relative flex flex-col items-center">
        <div className="relative">
          <div
            suppressHydrationWarning
            aria-label="sleepy cat"
            role="img"
            className="h-80 w-80 rounded-3xl bg-center bg-cover"
            style={{
              backgroundImage:
                'url(https://media1.tenor.com/m/BFv6MHd3tmsAAAAd/sleepy-sleepycat.gif)',
            }}
          />
        </div>

        <a
          href="https://github.com/rastorasto"
          target="_blank"
          rel="noreferrer"
          onClick={handleGitHubClick}
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20 hover:scale-105"
        >
          <GithubIcon />
          GitHub
        </a>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <a
            href="mailto:meow@rasto.org"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20 hover:scale-105"
          >
            <MailIcon />
            Email
          </a>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
