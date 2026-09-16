const fs = require('fs');

const csp = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'"
].join('; ');

const config = {
  buildCommand: "node build.mjs",
  outputDirectory: "dist",
  installCommand: "npm install --omit=dev",
  framework: null,
  cleanUrls: true,
  trailingSlash: false,
  headers: [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options",  value: "nosniff" },
        { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options",         value: "DENY" },
        { key: "Permissions-Policy",      value: "camera=(), microphone=(), geolocation=()" },
        { key: "Content-Security-Policy", value: csp }
      ]
    },
    {
      source: "/assets/(.*)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=86400" }
      ]
    }
  ],
  rewrites: [
    { source: "/work/arc",                       destination: "/work/arc/index.html" },
    { source: "/work/verdant",                   destination: "/work/verdant/index.html" },
    { source: "/work/forma",                     destination: "/work/forma/index.html" },
    { source: "/studio",                         destination: "/studio/index.html" },
    { source: "/contact",                        destination: "/contact/index.html" },
    { source: "/insights",                       destination: "/insights/index.html" },
    { source: "/insights/the-art-of-restraint",  destination: "/insights/the-art-of-restraint/index.html" },
    { source: "/insights/motion-with-meaning",   destination: "/insights/motion-with-meaning/index.html" },
    { source: "/insights/a-more-considered-web", destination: "/insights/a-more-considered-web/index.html" }
  ]
};

fs.writeFileSync('vercel.json', JSON.stringify(config, null, 2) + '\n', 'utf8');
console.log('vercel.json written successfully');
