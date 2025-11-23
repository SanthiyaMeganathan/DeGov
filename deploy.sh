#!/bin/bash

# DeGov Platform Deployment Helper
# This script helps you deploy your application to various platforms

echo "🚀 DeGov Platform Deployment Helper"
echo "======================================"

# Check if project can build
echo ""
echo "📦 Testing build process..."
if npm run build; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo ""
echo "🌐 Choose your deployment platform:"
echo "1. Vercel (Recommended)"
echo "2. Netlify"
echo "3. Manual instructions"
echo "4. Preview build locally"

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Vercel Deployment"
        echo "===================="
        echo "1. Install Vercel CLI: npm i -g vercel"
        echo "2. Login to Vercel: vercel login"
        echo "3. Deploy: vercel --prod"
        echo ""
        echo "Or use GitHub integration:"
        echo "1. Push code to GitHub"
        echo "2. Visit vercel.com and import repository"
        echo "3. Automatic deployments on every push!"
        ;;
    2)
        echo ""
        echo "🚀 Netlify Deployment"
        echo "===================="
        echo "1. Install Netlify CLI: npm i -g netlify-cli"
        echo "2. Login to Netlify: netlify login"
        echo "3. Deploy: netlify deploy --prod --dir=dist"
        echo ""
        echo "Or use drag & drop:"
        echo "1. Go to netlify.com"
        echo "2. Drag and drop your 'dist' folder"
        echo "3. Instant deployment!"
        ;;
    3)
        echo ""
        echo "📖 Manual Deployment Options"
        echo "============================"
        echo "Check DEPLOYMENT.md for complete instructions covering:"
        echo "- Vercel"
        echo "- Netlify"
        echo "- GitHub Pages"
        echo "- Firebase Hosting"
        echo "- And more!"
        ;;
    4)
        echo ""
        echo "👀 Starting preview server..."
        npm run preview
        ;;
    *)
        echo "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎯 Post-deployment checklist:"
echo "- ✅ Website loads correctly"
echo "- ✅ Wallet connection works (MetaMask required)"
echo "- ✅ Arbitrum network switching works"
echo "- ✅ Smart contract integration functions"
echo "- ✅ Mobile responsiveness verified"
echo ""
echo "🎉 Happy deploying! Your DApp is ready for the Arbitrum Hackathon!"