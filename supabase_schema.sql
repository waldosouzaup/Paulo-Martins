-- SQL para atualizar o banco de dados Supabase com as novas colunas e recursos do sistema.
-- Copie e cole cada bloco abaixo no editor SQL do seu painel Supabase (https://supabase.com) e clique em "Run".

-- 1. NOVOS CAMPOS NA TABELA "properties" (IMÓVEIS)
-- Adiciona suporte para Imóvel do Mês, Slug Amigável da URL, Breve Descrição e Proximidades.

ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS floor_plan_url TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS floor_plans JSONB DEFAULT '[]'::jsonb;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS brief_desc_home TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_school TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_university TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_shopping TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_restaurant TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_hospital TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_banks TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_supermarkets TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_gyms TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_bakeries TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_transport TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS virtual_tour_url TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS datasheet_url TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS seo_image_url TEXT;

-- Cria um índice na coluna slug para buscas de alto desempenho na página de detalhes
CREATE UNIQUE INDEX IF NOT EXISTS idx_properties_slug ON properties (slug);


-- 2. (OPCIONAL) SEED RECORRENTES / SLUGS ANTERIORES
-- Gera amigavelmente slugs para quaisquer registros preexistentes que ainda não possuam um slug configurado.
-- (Função utilitária para converter títulos existentes em slugs válidos).

CREATE OR REPLACE FUNCTION generate_slug(title text) RETURNS text AS $$
DECLARE
  slug text;
BEGIN
  -- Converte caracteres especiais com acentos e formata em minúsculas
  slug := lower(unaccent(title));
  -- Remove tudo exceto letras, números, espaços e hifens
  slug := regexp_replace(slug, '[^a-z0-9\s|-]', '', 'g');
  -- Converte espaços em hifens
  slug := regexp_replace(slug, '[\s|_-]+', '-', 'g');
  -- Remove hifens duplicados ou nas extremidades
  slug := trim(both '-' from slug);
  RETURN slug;
END;
$$ LANGUAGE plpgsql;

-- Executa a atualização para preencher slugs antigos, caso o banco de dados possua dados anteriores:
-- (Certifique-se de ter a extensão "unaccent" instalada para utilizar a função generate_slug)
CREATE EXTENSION IF NOT EXISTS unaccent;
UPDATE properties SET slug = generate_slug(title) WHERE slug IS NULL OR slug = '';


-- 3. TABELA DE ALERTAS DE IMÓVEIS (PROPERTY ALERTS)
-- Permite que clientes cadastrem filtros específicos para receber notificações de novos imóveis.
CREATE TABLE IF NOT EXISTS property_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    purpose TEXT DEFAULT 'Todos',
    type TEXT DEFAULT 'Todos',
    max_price TEXT DEFAULT 'Todos',
    beds TEXT DEFAULT 'Todos',
    city TEXT DEFAULT 'Todos',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Permissões de Leitura e Escrita Públicas (caso RLS esteja ativo)
ALTER TABLE property_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir inserções públicas em property_alerts" ON property_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir leitura para administradores autenticados" ON property_alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir exclusões para administradores autenticados" ON property_alerts FOR DELETE TO authenticated USING (true);


-- 4. TABELA DE CONFIGURAÇÃO DO RESEND E ALERTAS POR E-MAIL (ALERT SETTINGS)
-- Armazena os dados confidenciais de envio de forma segura (restringido para administradores).
CREATE TABLE IF NOT EXISTS alert_settings (
    id TEXT PRIMARY KEY DEFAULT 'global-alerts-config',
    resend_api_key TEXT,
    resend_email_sender TEXT DEFAULT 'Paulo Martins Imóveis <radar@pmartinsimob.com.br>',
    resend_email_subject TEXT DEFAULT 'Nova oportunidade exclusiva para você: {{title}}',
    resend_email_template TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS de segurança para que o público geral não tenha acesso à chave da API do Resend no banco de dados
ALTER TABLE alert_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir leitura para administradores autenticados em alert_settings" ON alert_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir escrita para administradores autenticados em alert_settings" ON alert_settings FOR ALL TO authenticated USING (true);

-- Insere as configurações iniciais padrões caso não existam
INSERT INTO alert_settings (id, resend_email_sender, resend_email_subject, resend_email_template)
VALUES (
    'global-alerts-config',
    'Paulo Martins Imóveis <radar@pmartinsimob.com.br>',
    'Nova oportunidade exclusiva para você: {{title}}',
    '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Novo Imóvel Cadastrado</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0d0d0d; font-family: ''Helvetica Neue'', Helvetica, Arial, sans-serif; color: #ffffff;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #121212; border: 1px solid #1a1a1a; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);">
    <!-- Header -->
    <tr>
      <td align="center" style="padding: 40px 20px; background-color: #0a0a0a; border-bottom: 2px solid #bfa054;">
        <h1 style="color: #bfa054; margin: 0; font-size: 26px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase;">Paulo Martins</h1>
        <p style="color: #8c8c8c; margin: 5px 0 0 0; font-size: 11px; tracking: 4px; uppercase; letter-spacing: 3px;">IMÓVEIS EXCLUSIVOS</p>
      </td>
    </tr>
    <!-- Cover Image -->
    <tr>
      <td>
        <img src="{{imageUrl}}" alt="{{title}}" style="width: 100%; height: 300px; object-fit: cover; display: block;" referrerPolicy="no-referrer">
      </td>
    </tr>
    <!-- Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #bfa054; font-weight: bold;">Nova Oportunidade Encontrada</span>
        <h2 style="color: #ffffff; font-size: 22px; margin: 10px 0; font-weight: 400; line-height: 1.3;">{{title}}</h2>
        <p style="color: #b3b3b3; font-size: 14px; font-weight: 300; line-height: 1.6; margin-bottom: 25px;">{{brief_desc_home}}</p>
        
        <!-- Specs Table -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px; border-top: 1px solid #262626; border-bottom: 1px solid #262626; padding: 15px 0;">
          <tr>
            <td style="padding: 5px 0; font-size: 13px; color: #8c8c8c;">Localização:</td>
            <td style="padding: 5px 0; font-size: 13px; color: #ffffff; font-weight: bold; text-align: right;">{{location}}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; font-size: 13px; color: #8c8c8c;">Preço:</td>
            <td style="padding: 5px 0; font-size: 15px; color: #bfa054; font-weight: bold; text-align: right;">{{price}}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; font-size: 13px; color: #8c8c8c;">Especificações:</td>
            <td style="padding: 5px 0; font-size: 13px; color: #ffffff; font-weight: bold; text-align: right;">{{beds}} Quartos • {{area}}m² • {{parking}} Vagas</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; font-size: 13px; color: #8c8c8c;">Finalidade:</td>
            <td style="padding: 5px 0; font-size: 13px; color: #ffffff; font-weight: bold; text-align: right;">{{purpose}} ({{type}})</td>
          </tr>
        </table>

        <!-- Call to action -->
        <table align="center" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="background-color: #bfa054; border-radius: 6px;">
              <a href="{{link}}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 14px; color: #000000; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 1px;">Ver Detalhes do Imóvel</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td align="center" style="padding: 30px; background-color: #0a0a0a; border-top: 1px solid #1a1a1a;">
        <p style="color: #666666; font-size: 11px; margin: 0 0 10px 0; line-height: 1.4;">
          Você está recebendo este e-mail porque cadastrou um alerta em nosso Radar Exclusivo em nosso site.
        </p>
        <p style="color: #666666; font-size: 11px; margin: 0;">
          &copy; 2026 Paulo Martins Imóveis. Todos os direitos reservados.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>'
)
ON CONFLICT (id) DO NOTHING;

