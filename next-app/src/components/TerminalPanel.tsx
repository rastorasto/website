'use client';

import { type SyntheticEvent, useEffect, useRef, useState } from 'react';

const PROMPT = 'cat@rasto.org:~$';

const COMMANDS: Record<string, string[]> = {
    help: ['Available commands:', 'help', 'about', 'clear', 'ls', 'pwd', 'whoami', 'take a guess :3'],
    about: ['meow terminal'],
    ls: ['meow', 'grrr', 'wuff.txt'],
    pwd: ['/home/cat'],
    whoami: ['cat'],
    matrix: ['coming soon...'],
    cat: ['Usage: cat [file]'],
    neofetch: [
      `                           ╱|、
         meeeow           (˚ˎ 。7
                          |、˜〵
                          じしˍ,)ノ`,
    ],
};

type Line = {
  type: 'prompt' | 'output';
  text: string;
};


export default function TerminalPanel() {
  const [value, setValue] = useState('');
  const [lines, setLines] = useState<Line[]>([{ type: 'output', text: 'Type help for help.' }]);
  const [falling, setFalling] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [lines]);

  const getSessionId = () => {
    if (sessionIdRef.current) {
      return sessionIdRef.current;
    }

    if (typeof window === 'undefined') {
      return 'unknown';
    }

    const key = 'terminalSessionId';
    let id = window.localStorage.getItem(key);

    if (!id) {
      if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        id = crypto.randomUUID();
      } else {
        id = `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      }
      window.localStorage.setItem(key, id);
    }

    sessionIdRef.current = id;
    return id;
  };

  const runCommand = (command: string) => {
    const normalized = command.trim().toLowerCase();

    if (!normalized) {
      return;
    }

    if (normalized === 'rm' || normalized.startsWith('rm ')) {
      setFalling(true);
      return;
    }

    if (normalized.startsWith('cat ')) {
      const target = normalized.slice(4).trim();

      if (target === 'wuff.txt') {
        let content = '';

        for(let i = 0; i < 10; i++) {
            content += 'wuff ';
            if(i % 5 === 0) content += '\n';
        }
        content += '\n~ from #$(_=. :3';

        setLines((current) => [...current, { type: 'output', text: content }]);
        return;
      }

      setLines((current) => [...current, { type: 'output', text: `cat: ${target}: No such file` }]);
      return;
    }

    if (normalized === 'clear') {
      setLines([]);
      return;
    }

    const response = COMMANDS[normalized];

    if (response) {
      setLines((current) => [...current, ...response.map((text) => ({ type: 'output' as const, text }))]);
      return;
    }

    setLines((current) => [
      ...current,
      { type: 'output', text: `Command not found: ${normalized}` },
      { type: 'output', text: 'Type help for help.' },
    ]);
  };

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const command = value;
    const trimmed = command.trim();

    if (trimmed && typeof navigator !== 'undefined') {
      const payload = {
        event: 'terminal_command',
        command: trimmed,
        sessionId: getSessionId(),
        url: window.location.pathname,
        timestamp: new Date().toISOString(),
      };

      const apiBase = process.env.API_URL ?? '';
      const endpoint = apiBase ? `${apiBase.replace(/\/$/, '')}/track` : '/api/track';

      try {
        navigator.sendBeacon(
          endpoint,
          new Blob([JSON.stringify(payload)], { type: 'application/json' })
        );
      } catch (e) {
        // fallback to fetch if sendBeacon fails
        void fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true });
      }
    }

    setLines((current) => [...current, { type: 'prompt', text: command }]);
    setValue('');
    runCommand(command);
  };

  // When falling is triggered, add a global class to animate the whole site,
  // then remove it after the animation finishes.
  useEffect(() => {
    if (!falling) return;

    const cls = 'fall-down-site';
    document.documentElement.classList.add(cls);

    const duration = 1200; // ms, should match animation duration
    const t = setTimeout(() => {
      document.documentElement.classList.remove(cls);
      setFalling(false);
    }, duration + 50);

    return () => {
      clearTimeout(t);
      document.documentElement.classList.remove(cls);
    };
  }, [falling]);

  return (
    <div
      className={`flex flex-col w-full h-full bg-black/90 font-mono transition-all duration-1000 outline-none min-h-[300px] ${falling ? 'fall-down' : ''}`}
      tabIndex={-1}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="overflow-y-auto whitespace-pre-wrap text-pink-400">
        {lines.map((line, index) => (
          <div key={index}>
            {line.type === 'prompt' ? (
              <div className="flex items-center gap-2">
                <span
                  className="shrink-0 text-pink-300 cursor-text"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.focus();
                  }}
                >
                  {PROMPT}
                </span>
                <span className="text-pink-400">{line.text}</span>
              </div>
            ) : (
              line.text
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
        <span
          className="cursor-text text-pink-300"
          onClick={() => inputRef.current?.focus()}
        >
          {PROMPT}
        </span>
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="flex-1 border-0 bg-transparent text-pink-400 caret-pink-400 outline-none placeholder:text-pink-700"
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
