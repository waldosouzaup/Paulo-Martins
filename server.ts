import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI, Type } from "@google/genai";

// Supabase details from connection file
const supabaseUrl = 'https://mkadaugyoptuptxlgpdq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rYWRhdWd5b3B0dXB0eGxncGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NzE4NjEsImV4cCI6MjA4MTU0Nzg2MX0.ey7aqjXJ0XMlxddvF8HY1hlB5UdXLS90qP-iHx6YZLw';

const supabaseServer = createClient(supabaseUrl, supabaseKey);

// Lazy initialization of GoogleGenAI SDK to respect environment variables safely
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      geminiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return geminiClient;
}

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

  // API Route: Translate text on the fly using Gemini
  app.post("/api/translate", async (req, res) => {
    const { text, to } = req.body;
    if (!text || !text.trim()) {
      return res.json({ translation: "" });
    }
    if (!to || to === "pt") {
      return res.json({ translation: text });
    }

    const client = getGeminiClient();
    if (!client) {
      console.warn("[Translation Backend] Gemini Client is not available. Check GEMINI_API_KEY.");
      return res.json({ translation: text }); // Fallback
    }

    const targetLang = to === "en" ? "English" : to === "es" ? "Spanish" : "Portuguese";

    try {
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Translate the following text into natural, professional brazilian real estate matching ${targetLang}. Return ONLY the direct translation of the content, preserving any formatting but with NO explanation or markdown wrappers:

${text}`,
      });

      const translated = response.text?.trim() || text;
      res.json({ translation: translated });
    } catch (err) {
      console.error(`[Translation Backend] Error translating text to ${to}:`, err);
      res.json({ translation: text }); // Fallback
    }
  });

  // API Route: Translate list of texts on the fly using Gemini (e.g. features list)
  app.post("/api/translate-list", async (req, res) => {
    const { texts, to } = req.body;
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return res.json({ translations: [] });
    }
    if (!to || to === "pt") {
      return res.json({ translations: texts });
    }

    const client = getGeminiClient();
    if (!client) {
      console.warn("[Translation Backend] Gemini Client is not available for list translation.");
      return res.json({ translations: texts }); // Fallback
    }

    const targetLang = to === "en" ? "English" : to === "es" ? "Spanish" : "Portuguese";

    try {
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are an expert real estate translator. Translate this array of strings into ${targetLang}. Maintain exact list size and ordering. Return a raw JSON array of strings ONLY. No markdown, no "json" wrappers, no other text:

${JSON.stringify(texts)}`,
        config: {
          responseMimeType: "application/json",
        }
      });

      const bodyText = response.text?.trim() || "";
      const parsed = JSON.parse(bodyText);
      if (Array.isArray(parsed)) {
        return res.json({ translations: parsed });
      }
      res.json({ translations: texts });
    } catch (err) {
      console.error(`[Translation Backend] Error translating list to ${to}:`, err);
      res.json({ translations: texts }); // Fallback
    }
  });

  // API Route: Generate optimized SEO metadata using Gemini
  app.post("/api/seo/generate", async (req, res) => {
    const { title, description, location, beds, parking, area } = req.body;

    const client = getGeminiClient();
    if (!client) {
      console.warn("[SEO Generator Backend] Gemini Client is not available.");
      return res.status(500).json({ error: "Gemini API Key is not configured." });
    }

    try {
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Gere títulos e descrições SEO otimizados para um imóvel de luxo com as seguintes informações:
Título original: ${title || ""}
Descrição original: ${description || ""}
Localização: ${location || ""}
Quartos: ${beds || ""}
Vagas: ${parking || ""}
Área: ${area || ""}

O público-alvo são compradores de imóveis de altíssimo padrão em Brasília. Foque em termos de sofisticação, exclusividade e prestígio.`,
        config: {
          systemInstruction: "Você é um especialista em SEO e Copywriting para o mercado imobiliário de luxo em Brasília. Seu objetivo é criar metatags extremamente atraentes, que estimulem o clique nas buscas orgânicas e redes sociais.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              seoTitle: {
                type: Type.STRING,
                description: "Título da página otimizado para SEO, com no máximo 60 caracteres. Deve conter o nome/tipo do imóvel e localização (ex: Lago Sul, Noroeste).",
              },
              seoDescription: {
                type: Type.STRING,
                description: "Meta description otimizada para buscadores (Google), com no máximo 160 caracteres. Deve incluir um call-to-action sutil.",
              },
              ogTitle: {
                type: Type.STRING,
                description: "Título otimizado para redes sociais (OpenGraph/WhatsApp), com no máximo 60 caracteres.",
              },
              ogDescription: {
                type: Type.STRING,
                description: "Descrição otimizada para redes sociais (OpenGraph/WhatsApp), com no máximo 150 caracteres.",
              }
            },
            required: ["seoTitle", "seoDescription", "ogTitle", "ogDescription"]
          },
        },
      });

      const resultText = response.text?.trim();
      if (!resultText) {
        throw new Error("No text returned from Gemini model.");
      }

      const seoData = JSON.parse(resultText);
      res.json(seoData);
    } catch (err: any) {
      console.error("[SEO Generator Backend] Error generating SEO metadata:", err);
      res.status(500).json({ error: "Falha ao gerar metadados de SEO." });
    }
  });

  // API Route: Manually trigger the keep-alive query and view logs
  app.get("/api/keep-alive", async (req, res) => {
    const result = await keepSupabaseAlive();
    res.json({
      status: result.success ? "success" : "failed",
      currentCheck: result,
      history: pingLogs
    });
  });

  // API Route: Send alert emails using Resend when a new property is registered
  app.post("/api/send-alert-emails", async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "Authorization token is missing" });
    }

    const { property } = req.body;
    if (!property) {
      return res.status(400).json({ error: "Missing property details" });
    }

    try {
      // 1. Authenticate the token with standard Supabase Auth
      const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
      if (authError || !user) {
        return res.status(401).json({ error: "Invalid credentials or unauthorized user" });
      }

      // 2. Create user-scoped Supabase client on-the-fly to respect RLS settings of alert_settings
      const supabaseForUser = createClient(supabaseUrl, supabaseKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      });

      // 3. Fetch alert config
      const { data: settings, error: settingsError } = await supabaseForUser
        .from('alert_settings')
        .select('*')
        .eq('id', 'global-alerts-config')
        .maybeSingle();

      if (settingsError) {
        console.error("[Alerts Backend] Failed to load alert_settings:", settingsError);
        return res.status(500).json({ error: `Failed to load settings: ${settingsError.message}` });
      }

      if (!settings || !settings.resend_api_key) {
        console.log("[Alerts Backend] Resend API Key is not configured on alert_settings table.");
        return res.json({ status: "skipped", message: "Resend API Key is not configured." });
      }

      // 4. Fetch all property alerts (registered customers filters)
      const { data: alerts, error: alertsError } = await supabaseForUser
        .from('property_alerts')
        .select('*');

      if (alertsError) {
        console.error("[Alerts Backend] Failed to load property_alerts:", alertsError);
        return res.status(500).json({ error: `Failed to load alerts list: ${alertsError.message}` });
      }

      if (!alerts || alerts.length === 0) {
        console.log("[Alerts Backend] No active alerts registered by customers.");
        return res.json({ status: "success", count: 0, message: "No registered alerts to notify." });
      }

      // 5. Filter matching alerts
      const cleanPrice = (val: string): number => {
        if (!val) return 0;
        return Number(val.replace(/\D/g, '')) || 0;
      };

      const cleanNum = (val: string): number => {
        if (!val) return 0;
        return Number(val.replace(/\D/g, '')) || 0;
      };

      const matchedAlerts = alerts.filter(al => {
        // Purpose Match
        if (al.purpose && al.purpose !== 'Todos' && property.purpose) {
          if (al.purpose.toLowerCase() !== property.purpose.toLowerCase()) return false;
        }

        // Type Match
        if (al.type && al.type !== 'Todos' && property.type) {
          if (al.type.toLowerCase() !== property.type.toLowerCase()) return false;
        }

        // Location/City Match
        if (al.city && al.city !== 'Todos' && al.city.trim() !== '') {
          const alertCity = al.city.toLowerCase().trim();
          const propCity = (property.city || '').toLowerCase().trim();
          const propLoc = (property.location || '').toLowerCase().trim();
          if (!propCity.includes(alertCity) && !propLoc.includes(alertCity)) return false;
        }

        // Beds Match
        if (al.beds && al.beds !== 'Todos') {
          const minBeds = cleanNum(al.beds);
          const propBeds = cleanNum(property.beds);
          if (propBeds < minBeds) return false;
        }

        // Price Match
        if (al.max_price && al.max_price !== 'Todos') {
          const maxPrice = cleanPrice(al.max_price);
          const propPrice = cleanPrice(property.price);
          // If maxPrice is specified, property must be <= maxPrice
          if (propPrice > 0 && maxPrice > 0 && propPrice > maxPrice) return false;
        }

        return true;
      });

      console.log(`[Alerts Backend] Match result: New property matches ${matchedAlerts.length}/${alerts.length} registered filters.`);

      if (matchedAlerts.length === 0) {
        return res.json({ status: "success", count: 0, notified: [] });
      }

      // 6. Send emails in parallel via standard Fetch to Resend API
      const notifiedEmails: string[] = [];
      const emailPromises = matchedAlerts.map(async (alert) => {
        try {
          const pDesc = property.brief_desc_home || property.description || '';
          const pLink = `https://${req.headers.host || "pmartinsimob.com.br"}/${property.slug || property.id}`;

          // Substring Replacement
          let htmlContent = (settings.resend_email_template || '')
            .split('{{title}}').join(property.title || '')
            .split('{{location}}').join(property.location || '')
            .split('{{price}}').join(property.price || '')
            .split('{{beds}}').join(property.beds || '')
            .split('{{area}}').join(property.area || '')
            .split('{{parking}}').join(property.parking || '')
            .split('{{purpose}}').join(property.purpose || '')
            .split('{{type}}').join(property.type || '')
            .split('{{brief_desc_home}}').join(pDesc)
            .split('{{imageUrl}}').join(property.imageUrl || property.image_url || '')
            .split('{{link}}').join(pLink);

          let subjectContent = (settings.resend_email_subject || 'Nova oportunidade exclusiva encontrada: {{title}}')
            .split('{{title}}').join(property.title || '')
            .split('{{price}}').join(property.price || '');

          const resendResponse = await globalThis.fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${settings.resend_api_key.trim()}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: settings.resend_email_sender || 'Paulo Martins Imóveis <radar@pmartinsimob.com.br>',
              to: [alert.email],
              subject: subjectContent,
              html: htmlContent
            })
          });

          if (resendResponse.ok) {
            notifiedEmails.push(alert.email);
          } else {
            const errBody = await resendResponse.text();
            console.error(`[Alerts Backend] Resend returned error status ${resendResponse.status} for ${alert.email}:`, errBody);
          }
        } catch (err) {
          console.error(`[Alerts Backend] Exception sending email to ${alert.email}:`, err);
        }
      });

      await Promise.all(emailPromises);

      return res.json({
        status: "success",
        count: notifiedEmails.length,
        notified: notifiedEmails
      });
    } catch (err: any) {
      console.error("[Alerts Backend] Failed during alert dispatches:", err);
      return res.status(500).json({ error: err.message || "Unknown error during dispatch" });
    }
  });

  // Serve robots.txt for AI crawlers and search indexers
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    const domain = req.headers.host || "pmartinsimob.com.br";
    res.send(`User-agent: *
Allow: /
Sitemap: https://${domain}/sitemap.xml
`);
  });

// Helper to slugify on the server side
const slugifyServer = (text: string): string => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

// Serve dynamic, rich sitemap.xml for full-coverage indexing
app.get("/sitemap.xml", async (req, res) => {
  res.type("application/xml");
  const domain = req.headers.host || "pmartinsimob.com.br";
  const protocol = req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
  const baseUrl = `${protocol}://${domain}`;

  let propertyUrls = "";
  try {
    const { data: properties } = await supabaseServer.from('properties').select('id, title, slug');
    if (properties && properties.length > 0) {
      properties.forEach((prop: any) => {
        const slug = prop.slug || (prop.title ? slugifyServer(prop.title) : prop.id);
        propertyUrls += `
  <url>
    <loc>${baseUrl}/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      });
    }
  } catch (err) {
    console.error("Error generating dynamic sitemap properties:", err);
  }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/properties</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/alto-sobradinho</loc>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>
  ${propertyUrls}
</urlset>`;

    res.send(sitemap.trim());
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
