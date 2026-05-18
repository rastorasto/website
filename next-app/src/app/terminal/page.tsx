import TerminalPanel from '@/components/TerminalPanel';

export default function Terminal() {
  return (
    <main className="min-h-screen bg-black p-4 font-mono text-pink-400">
      <div className="mx-auto max-w-4xl">
        <TerminalPanel />
      </div>
    </main>
  );
}
