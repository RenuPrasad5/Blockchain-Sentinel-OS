#!/bin/bash

# Sovereign OS Production Deployment Script
echo "🚀 Initializing Deployment Sequence for Sovereign OS..."

# 1. Clean previous builds
echo "🧹 Cleaning workspace..."
rm -rf dist

# 2. Install dependencies
echo "📦 Verifying dependencies..."
npm install

# 3. Running Production Build
echo "🏗️ Building for production..."
npm run build

# 4. Check build success
if [ $? -eq 0 ]; then
    echo "✅ Build Successful."
    
    # 5. Deploy to Vercel (Requires Vercel CLI)
    if command -v vercel &> /dev/null
    then
        echo "🌐 Deploying to Vercel Production..."
        vercel --prod
    else
        echo "⚠️ Vercel CLI not found. Build is ready in /dist directory."
        echo "👉 You can manually upload the /dist folder to your hosting provider."
    fi
else
    echo "❌ Build Failed. Aborting Deployment."
    exit 1
fi

echo "🏁 Deployment Process Concluded."
