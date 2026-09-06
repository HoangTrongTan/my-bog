const fs = require('fs');
const path = require('path');

const apiKey = process.env.AUTH_API_KEY || process.env.GEMINI_API_KEY || '';

const targetPath = path.join(__dirname, '../src/app/configs/env.generated.ts');

const envConfigFile = `// Auto-generated file by scripts/set-env.js during build on Vercel / CI
export const GENERATED_AUTH_API_KEY = "${apiKey.trim()}";
`;

fs.writeFileSync(targetPath, envConfigFile);
console.log(`[set-env.js] Successfully injected AUTH_API_KEY into ${targetPath}`);
