# Paulo Martins – Imóveis Exclusivos em Brasília

Uma plataforma web de alta performance e experiência imersiva desenvolvida para a vitrine de imóveis de luxo e atendimento personalizado do corretor **Paulo Martins** em Brasília. 

Este projeto foi projetado com as melhores práticas de desenvolvimento moderno, focando em **extrema otimização de performance (Core Web Vitals)**, **indexação orgânica avançada para Google (SEO)** e **preparação semântica para indexação em Motores de Busca por Inteligência Artificial (AI Search engines & LLM Grounding)**.

---

## 👨‍💻 Autor & Desenvolvimento
Desenvolvido com excelência por:
*   **Waldo Eller**
*   **Website:** [waldoeller.com](https://waldoeller.com)

---

## 🚀 Arquitetura e Tecnologias Core

O sistema utiliza uma abordagem **full-stack moderna**, combinando a velocidade de renderização no cliente com o poder de manipulação e segurança de um servidor backend sob demanda:

*   **Frontend (SPA Imersiva):**
    *   **React 19 & Vite**: Framework de altíssimo desempenho, garantindo inicialização instantânea e atualização de componentes sem atraso.
    *   **Tailwind CSS**: Estilização atômica para uma interface minimalista, focada em tons de dourado real e cinza cósmico, remetendo a exclusividade.
    *   **Framer Motion**: Micro-animações fluidas e transições elegantes que guiam o olhar do usuário.
    *   **React Router DOM v7**: Roteamento dinâmico baseado em slugs amigáveis.
    *   **jsPDF**: Módulo para geração e exportação dinâmica de fichas técnicas em formato PDF profissional em tempo real.
*   **Backend (Servidor Seguro & SSR Híbrido):**
    *   **Express v5.2.1 (com TSX/Node)**: Servidor customizado atuando na entrega de ativos estáticos, proxy de APIs e motor de injeção de SEO em tempo real.
    *   **Vite Middleware**: Integração perfeita do servidor Express com o ecossistema Vite para ambiente de desenvolvimento.
    *   **Esbuild**: Compilador de alta velocidade para empaquetar o servidor em um único arquivo CJS (`dist/server.cjs`), otimizando o cold start em produção.
*   **Banco de Dados & Armazenamento:**
    *   **Supabase (PostgreSQL)**: Banco de dados relacional robusto com Row Level Security (RLS) habilitado.
    *   **Extensão unaccent & PL/pgSQL**: Funções procedimentais personalizadas diretamente no banco (ex: `generate_slug`) para sanitização de URLs em tempo de inserção de dados.
*   **Inteligência Artificial (AI Engine):**
    *   **Google Gemini SDK (`@google/genai`)**: Utilizado server-side para enriquecimento inteligente de dados, SEO automatizado e categorização de proximidades de imóveis de maneira dinâmica.

---

## 🔍 SEO Avançado e Indexação para Google & IAs (Deep SEO & AI Grounding)

Para garantir que cada imóvel listado alcance as primeiras posições do Google e seja facilmente referenciado por inteligências artificiais (como Gemini, ChatGPT, Claude e Perplexity), a plataforma conta com uma estrutura de SEO única de 4 pilares:

### 1. Injeção Dinâmica de Meta Tags em Tempo de Execução (Hybrid SSR)
Para contornar o problema tradicional das SPAs (onde os bots de busca leem apenas uma página em branco antes do carregamento do JavaScript), o servidor Express em `server.ts` intercepta as requisições destinadas aos imóveis:
1. Ele identifica o slug ou ID do imóvel diretamente no caminho da URL (ex: `/property/singulare-home-riva...`).
2. Realiza uma consulta direta e ultra-rápida no Supabase Server-Side.
3. Se o imóvel for localizado, o servidor substitui as tags padrão do `index.html` por valores reais do imóvel antes de enviar a resposta para o navegador:
    *   `<title>`: Título do imóvel personalizado adicionando a marca do Corretor.
    *   `<meta name="description">`: Descrição resumida do imóvel (até 160 caracteres), livre de espaços duplicados.
    *   **Open Graph (`og:title`, `og:description`, `og:image`, `og:url`)**: Ideal para renderização perfeita de previews de links no WhatsApp, Telegram, LinkedIn, Facebook e nas respostas rápidas de assistentes de IA.
    *   **Twitter Cards**: Formatação otimizada para a plataforma X.

### 2. Estruturação de Dados com JSON-LD (Schema.org)
Adotamos o **padrão ouro de estruturação de dados** injetando scripts dinâmicos de tipo `application/ld+json` na seção `<head>` do HTML servido:
*   **RealEstateListing**: Identifica para os robôs do Google que a página é uma listagem de imóvel comercializável ativa.
*   **Apartment / SingleFamilyResidence**: Detalha se o imóvel é um apartamento ou casa residencial.
*   **QuantitativeValue**: Especifica o tamanho do espaço em metros quadrados de forma padronizada (`MTK`).
*   **PostalAddress**: Estrutura cidade, estado, país e logradouro do imóvel de forma legível semanticamente.
*   **Offer**: Define o preço exato (`priceCurrency: BRL`) e status de disponibilidade.

Essa estruturação ajuda os assistentes de IA a extrair detalhes diretamente, permitindo respostas diretas como: *"Sim, o corretor Paulo Martins possui um apartamento de 3 quartos e 120m² localizado no Setor Noroeste por R$ X"*.

### 3. Detecção de Suporte WebP e Otimização de Imagens (LCP Booster)
A velocidade de carregamento é um fator de ranqueamento crítico no Google (Core Web Vitals). Imagens pesadas aumentam o tempo de **LCP (Largest Contentful Paint)**.
*   **Função de Detecção Sem Bloqueio**: Criamos um detector em `PropertyContext.tsx` que desenha um canvas invisível em menos de 1 milissegundo no navegador do cliente para validar suporte nativo ao formato WebP.
*   **URLs Inteligentes**: A função `getOptimizedImageUrl` reescreve requisições dinâmicas de imagens hospedadas no Unsplash e no Supabase Storage:
    *   Se o WebP for suportado, o formato padrão (`format=webp` ou `fm=webp`) é injetado como parâmetro da URL.
    *   Parâmetros de redimensionamento de largura (`w` ou `width`) e qualidade visual controlada (`q` ou `quality` ajustados por padrão em `75-80%`) são anexados dinamicamente para evitar o download desnecessário de imagens em ultra-resolução.

### 4. Geração Dinâmica de Sitemap XML
Um sitemap atualizado é gerado automaticamente antes de cada build de produção através do script `scripts/generate-sitemap.ts`:
*   Consulta dinamicamente todos os imóveis ativos no Supabase.
*   Gera as tags `<loc>`, `<lastmod>`, `<changefreq>` e `<priority>` ideais para cada imóvel e página estática.
*   Gera o arquivo `sitemap.xml` pronto para cadastro no Google Search Console.

---

## 💼 Funcionalidades de Negócio

*   **Radar de Oportunidades Exclusivas**: Captação de leads onde clientes cadastram as preferências desejadas de imóveis (`property_alerts`).
*   **Notificações de Email Automatizadas (Resend Integration)**: Painel administrativo com controle de chaves e templates ricos salvos de forma segura em `alert_settings`.
*   **Download de Brochura (Ficha Técnica PDF)**: Relatório estético gerado no lado do cliente que permite que o visitante salve as especificações detalhadas do imóvel em PDF com um clique.
*   **Proximidades Detalhadas**: Exibição interativa e geolocalizada de escolas, academias, hospitais, shoppings e comércios no entorno de cada imóvel.

---

## 🛠️ Como Executar o Projeto Localmente

### Pré-requisitos
*   Node.js (v18 ou superior)
*   NPM

### Instalação de Dependências
```bash
npm install
```

### Configuração de Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto (utilize o `.env.example` como base) preenchendo as chaves:
```env
# Exemplo de configuração Supabase
VITE_SUPABASE_URL=https://sua-url-supabase.supabase.co
VITE_SUPABASE_ANON_KEY=seu-token-anonimo-supabase

# Gemini API (Utilizado no lado do Servidor)
GEMINI_API_KEY=sua-chave-api-gemini
```

### Executar em Desenvolvimento (Modo Dev)
Inicia o servidor Express acoplado ao middleware dinâmico do Vite:
```bash
npm run dev
```
O projeto estará disponível em `http://localhost:3000`.

### Compilar para Produção (Build)
Executa a geração do Sitemap dinâmico, compila os arquivos do cliente (React) e realiza o empacotamento em CJS do servidor Express via `esbuild`:
```bash
npm run build
```

### Executar em Produção
```bash
npm run start
```

---

## 🔐 Segurança & Boas Práticas
*   **Row Level Security (RLS)** ativa no Supabase, garantindo que chaves confidenciais do Resend e logs sensíveis de e-mails nunca sejam expostos no frontend.
*   **Zero Vazamento de Chaves**: A chave do Google Gemini (`GEMINI_API_KEY`) é mantida estritamente no lado do servidor em variáveis ocultas e nunca trafega para o navegador.
