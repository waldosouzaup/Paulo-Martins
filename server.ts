import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";

// Supabase details from connection file
const supabaseUrl = 'https://mkadaugyoptuptxlgpdq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rYWRhdWd5b3B0dXB0eGxncGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NzE4NjEsImV4cCI6MjA4MTU0Nzg2MX0.ey7aqjXJ0XMlxddvF8HY1hlB5UdXLS90qP-iHx6YZLw';

const supabaseServer = createClient(supabaseUrl, supabaseKey);

// Maintain logs of previous checks
const pingLogs: Array<{ timestamp: string; success: boolean; message: string }> = [];

async function keepSupabaseAlive(): Promise<{ success: boolean; message: string }> {
  const timestamp = new Date().toISOString();
  console.log(`[Keep-Alive] [${timestamp}] Starting keep-alive query to Supabase...`);
  try {
    // Standard quick select query to check properties table connection
    const { data, error } = await supabaseServer.from('properties').select('id').limit(1);
    
    if (error) {
      const errMsg = `Supabase Error: ${error.message}`;
      console.error(`[Keep-Alive] [${timestamp}] ${errMsg}`);
      const logEntry = { timestamp, success: false, message: errMsg };
      pingLogs.push(logEntry);
      if (pingLogs.length > 50) pingLogs.shift();
      return logEntry;
    }
    
    const successMsg = `Supabase is online. Found properties sample: ${data?.length || 0}`;
    console.log(`[Keep-Alive] [${timestamp}] ${successMsg}`);
    const logEntry = { timestamp, success: true, message: successMsg };
    pingLogs.push(logEntry);
    if (pingLogs.length > 50) pingLogs.shift();
    return logEntry;
  } catch (err: any) {
    const errorStr = err?.message || String(err);
    const errMsg = `Unexpected error: ${errorStr}`;
    console.error(`[Keep-Alive] [${timestamp}] ${errMsg}`);
    const logEntry = { timestamp, success: false, message: errMsg };
    pingLogs.push(logEntry);
    if (pingLogs.length > 50) pingLogs.shift();
    return logEntry;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing middleware
  app.use(express.json());

  // API Route: Manually trigger the keep-alive query and view logs
  app.get("/api/keep-alive", async (req, res) => {
    const result = await keepSupabaseAlive();
    res.json({
      status: result.success ? "success" : "failed",
      currentCheck: result,
      history: pingLogs
    });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Paulo Martins Server] Server running on http://0.0.0.0:${PORT}`);
    
    // Run keep-alive immediately on server start
    keepSupabaseAlive();

    // Set daily interval (every 12 hours check to ensure super-active state)
    // 12 hours is safer because sometimes Supabase counts inactivity based on consecutive idle days, 
    // and checking twice a day guarantees it completely avoids inactivity triggers.
    const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
    setInterval(() => {
      keepSupabaseAlive();
    }, TWELVE_HOURS_MS);
  });
}

startServer();
