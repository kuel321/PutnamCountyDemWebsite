#!/bin/bash
set -e

echo "Pulling latest code..."
git pull

echo "Installing dependencies..."
npm install

echo "Running database migrations..."
npx payload migrate

echo "Generating types..."
npm run generate:types

echo "Building..."
npm run build

echo "Restarting app..."
pm2 restart putnamcountydemwebsite

echo "Done!"
