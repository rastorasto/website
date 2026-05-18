'use client';

import { type SyntheticEvent, useEffect, useRef, useState } from 'react';

const PROMPT = 'cat@rasto.org:~$';

const COMMANDS: Record<string, string[]> = {
    help: ['Available commands:', 'help', 'about', 'clear', 'ls', 'pwd', 'whoami'],
    about: ['meow terminal'],
    ls: ['meow', 'grrr', 'wuff.txt'],
    pwd: ['/home/cat'],
    whoami: ['user'],
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const runCommand = (command: string) => {
    const normalized = command.trim().toLowerCase();

    if (!normalized) {
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

    setLines((current) => [...current, { type: 'prompt', text: command }]);
    setValue('');
    runCommand(command);
  };

  return (
    <div className="flex flex-col bg-black/90 p-4 font-mono">
      <div className="overflow-y-auto whitespace-pre-wrap text-pink-400">
        {lines.map((line, index) => (
          <div key={index}>
            {line.type === 'prompt' ? (
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-pink-300">{PROMPT}</span>
                <span className="text-pink-400">{line.text}</span>
              </div>
            ) : (
              line.text
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
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
