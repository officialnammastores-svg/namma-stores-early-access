import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { cloudflare } from '@cloudflare/vite-plugin';
import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';

// Ensure Cloudflare Workers local runtime receives process environment variables via .dev.vars
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey) {
  try {
    const devVarsContent = `SUPABASE_URL="${supabaseUrl}"\nSUPABASE_SERVICE_ROLE_KEY="${supabaseKey}"\n`;
    fs.writeFileSync('.dev.vars', devVarsContent, 'utf-8');
  } catch {
    // safe fallback
  }
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), cloudflare()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
