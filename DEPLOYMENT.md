# Deployment Guide - DeGov Platform

This guide covers multiple deployment options for your decentralized governance platform.

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended)
Vercel provides excellent performance and automatic deployments.

#### Steps:
1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - DeGov Platform"
   git branch -M main
   git remote add origin https://github.com/yourusername/frontend-degov.git
   git push -u origin main
   ```

2. **Deploy via Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your `frontend-degov` repository
   - Vercel will auto-detect Vite configuration
   - Click "Deploy"

3. **Configure Environment (if needed):**
   - Go to Project Settings > Environment Variables
   - Add any environment variables your app needs

#### Automatic Features:
- ✅ Automatic builds on every git push
- ✅ Preview deployments for pull requests
- ✅ Custom domain support
- ✅ Global CDN
- ✅ Serverless functions ready

### Option 2: Netlify
Great alternative with drag-and-drop deployment option.

#### Method A: Git Integration
1. **Push to GitHub** (same as above)
2. **Deploy via Netlify:**
   - Visit [netlify.com](https://netlify.com)
   - Sign in with GitHub
   - Click "New site from Git"
   - Choose your repository
   - Build settings will be auto-detected from `netlify.toml`
   - Click "Deploy site"

#### Method B: Manual Deployment
1. **Build locally:**
   ```bash
   npm run build
   ```
2. **Deploy:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your `dist` folder to Netlify

### Option 3: GitHub Pages
Free hosting directly from your GitHub repository.

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json:**
   Add to scripts:
   ```json
   "homepage": "https://yourusername.github.io/frontend-degov",
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

### Option 4: Firebase Hosting
Google's hosting platform with great performance.

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase:**
   ```bash
   firebase init hosting
   # Choose 'dist' as public directory
   # Configure as single-page app: Yes
   # Set up automatic builds: No
   ```

3. **Build and Deploy:**
   ```bash
   npm run build
   firebase deploy
   ```

## 🔧 Environment Configuration

### Required Environment Variables
Create a `.env.production` file for production-specific settings:

```env
# Production Environment
VITE_APP_ENVIRONMENT=production
VITE_CONTRACT_ADDRESS=0x8b582a90B92e689D53c249d3cB55AD878571E490
VITE_ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
VITE_APP_NAME=DeGov Platform
```

### Security Considerations
- ✅ Contract address is public (safe to expose)
- ✅ RPC URLs are public endpoints
- ❌ Never expose private keys or sensitive data
- ✅ All environment variables starting with `VITE_` are safe for frontend

## 🌐 Custom Domain Setup

### Vercel
1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed

### Netlify
1. Go to Site Settings > Domain Management
2. Add custom domain
3. Configure DNS settings

## 📱 Testing Deployment

After deployment, verify these features work:

### Essential Tests:
- [ ] Home page loads correctly
- [ ] Wallet connection works with MetaMask
- [ ] Network switching to Arbitrum works
- [ ] Communities page loads
- [ ] Navigation between pages works
- [ ] Responsive design on mobile devices

### Smart Contract Integration:
- [ ] Contract interaction works on live network
- [ ] Community creation functions
- [ ] Proposal creation and voting
- [ ] User data fetching

## 🚨 Troubleshooting

### Common Issues:

**Build Failures:**
- Ensure all dependencies are installed
- Check for TypeScript/ESLint errors
- Verify React version compatibility

**Wallet Connection Issues:**
- Ensure HTTPS deployment (required for MetaMask)
- Check network configuration
- Verify contract address is correct

**Routing Issues:**
- Single-page app redirects are configured in `vercel.json` and `netlify.toml`
- For other platforms, ensure all routes redirect to `index.html`

### Performance Optimization:
- ✅ Vite automatically optimizes bundles
- ✅ Code splitting is enabled
- ✅ Static assets are cached
- ✅ Gzip compression is enabled

## 🎯 Deployment Checklist

- [ ] Code is pushed to GitHub
- [ ] Build completes successfully
- [ ] Deployment platform is chosen
- [ ] Environment variables are configured
- [ ] Custom domain is set up (optional)
- [ ] SSL certificate is active
- [ ] All pages load correctly
- [ ] Wallet integration works
- [ ] Mobile responsiveness is verified
- [ ] Smart contract integration is tested

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [MetaMask Integration Guide](https://docs.metamask.io/guide/)
- [Arbitrum Network Info](https://arbitrum.io/bridge)

## 📞 Support

If you encounter issues during deployment:
1. Check the platform-specific documentation
2. Verify your build works locally with `npm run build && npm run preview`
3. Check browser console for JavaScript errors
4. Ensure MetaMask is installed and connected to Arbitrum

---

**Your DeGov Platform is ready for the Arbitrum Hackathon! 🚀**