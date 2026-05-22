import express from 'express';
import type { Request, Response } from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const app = express();
app.use(express.json());

const allowedOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:8088,http://localhost:3000, http://127.0.0.1:8088')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error(`Origin not allowed by CORS: ${origin}`));
        },
        credentials: true,
    })
);

const dbPath = process.env.SQLITE_PATH || './database.db';
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const TERMINAL_DISCORD_WEBHOOK_URL = process.env.TERMINAL_DISCORD_WEBHOOK_URL;

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS tracks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip TEXT NOT NULL,
        body TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
`);

async function sendWebhook(url: string, content: string) {
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
        })
    } catch (error) {
        console.error('Failed to send webhook:', error);
    }
}

app.post('/track', async (req: Request, res: Response) => {
    const ip =
        (req.headers['cf-connecting-ip'] as string)?.trim() ??
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
        req.socket.remoteAddress ??
        req.ip ??
        'unknown';

    let rawBody = req.body ?? {};
    rawBody = JSON.stringify(rawBody);


    console.log('Track hit:', { ip, body: rawBody });

    await sendWebhook(DISCORD_WEBHOOK_URL!, `New track hit from IP: ${ip}\nBody: ${rawBody}`);

    try {
        const stmt = db.prepare('INSERT INTO tracks (ip, body) VALUES (?, ?)');
        const result = stmt.run(ip, rawBody);
        return res.status(201).json({ id: result.lastInsertRowid, ip });
    } catch (err: any) {
        console.error('Failed to insert track:', err);
        return res.status(500).json({ error: 'failed to record track' });
    }
});

app.get('/users', (req: Request, res: Response) => {
  const stmt = db.prepare('SELECT * FROM users');
  const users = stmt.all();
  res.json(users);
});

app.post('/users', (req: Request, res: Response) => {
    const { name, email } = req.body;
    try {
        const stmst = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
        const result = stmst.run(name, email);
        res.status(201).json({ id: result.lastInsertRowid, name, email });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

const PORT = 4000;

app.listen (PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
