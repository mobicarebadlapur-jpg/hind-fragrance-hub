// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro, VITE_* env injection, @ path alias, React/TanStack dedupe, error logger plugins,
//     and sandbox detection (port/host/strictPort).
//
// Hostinger runs the production app as a standard Node.js process, so explicitly
// select Nitro's Node server preset instead of relying on the wrapper's default target.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Public (publishable) backend config. These values are safe to ship to the browser.
// They are used as a build-time fallback so a production build still works when the
// CI/host environment does not provide the VITE_* variables (e.g. Hostinger builds,
// where .env is intentionally not committed).
const FALLBACK_SUPABASE_URL = "https://rgdwmvqbytlpmaobewfo.supabase.co";
const FALLBACK_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_KP1NDEaB1XmfMAY4ZOwNIw_Y6MNb6tz";

const supabaseUrl =
  process.env["VITE_SUPABASE_URL"] || process.env["SUPABASE_URL"] || FALLBACK_SUPABASE_URL;
const supabasePublishableKey =
  process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
  process.env["VITE_SUPABASE_ANON_KEY"] ||
  process.env["SUPABASE_PUBLISHABLE_KEY"] ||
  FALLBACK_SUPABASE_PUBLISHABLE_KEY;

export default defineConfig({
  define: {
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(supabaseUrl),
    "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(supabasePublishableKey),
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  nitro: {
    preset: "node-server",
  },
});

