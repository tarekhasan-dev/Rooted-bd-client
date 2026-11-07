const dns = require("node:dns");

dns.setServers([
  "1.1.1.1",
  "8.8.8.8",
]);

console.log("Custom DNS configured successfully!");

// Start Next.js after configuring DNS
require("./node_modules/next/dist/bin/next");   