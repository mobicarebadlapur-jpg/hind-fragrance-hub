// Hostinger Passenger entrypoint.
// Passenger provides PORT; Nitro must listen on that exact port.
process.env.NITRO_PORT = process.env.PORT;
process.env.NITRO_HOST = "0.0.0.0";
process.env.NITRO_SHUTDOWN_DISABLED = "true";

process.on("uncaughtException", (error) => {
  console.error("[Hostinger] uncaughtException:", error);
});

process.on("unhandledRejection", (reason) => {
  console.error("[Hostinger] unhandledRejection:", reason);
});

import("./.output/server/index.mjs").catch((error) => {
  console.error("[Hostinger] Failed to load Nitro server:", error);
  process.exitCode = 1;
});
