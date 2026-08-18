import { createStart } from "@tanstack/react-start";

// Keep Start-level configuration minimal while the Hostinger SSR runtime
// resolves the middleware chain. Global auth/CSRF middleware is attached
// locally to the affected server functions instead of the global SSR chain.
export const startInstance = createStart(() => ({}));
