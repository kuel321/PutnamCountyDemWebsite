#!/bin/bash
set -e

echo "Pulling latest code..."
git pull

echo "Installing dependencies..."
npm install

echo "Syncing database schema..."
cat > .deploy-schema-sync.mjs <<'NODEEOF'
import { getPayload } from 'payload'
import config from './src/payload.config.ts'
await getPayload({ config })
console.log('schema sync complete')
process.exit(0)
NODEEOF
npx tsx -r dotenv/config .deploy-schema-sync.mjs
rm -f .deploy-schema-sync.mjs

echo "Generating types..."
npm run generate:types

echo "Building..."
npm run build

echo "Restarting app..."
pm2 restart putnamcountydemwebsite

echo "Done!"
