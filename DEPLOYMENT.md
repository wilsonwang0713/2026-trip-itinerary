# 2026 Trip Itinerary - GitHub Pages Deployment Guide

## ✅ What's Been Done

1. **Repository Created**: `https://github.com/wilsonwang0713/2026-trip-itinerary`
2. **Code Pushed**: All files committed and pushed to the `main` branch
3. **Vite Config Updated**: Base path set to `/2026-trip-itinerary/` for GitHub Pages
4. **GitHub Actions Workflow**: Created `.github/workflows/deploy.yml` for automatic deployment

## 🚀 Next Steps (Manual)

### Step 1: Enable GitHub Pages

1. Go to: `https://github.com/wilsonwang0713/2026-trip-itinerary`
2. Click the **"Settings"** tab
3. In the left sidebar, click **"Pages"**
4. Under **"Build and deployment"**:
   - **Source**: Select **"GitHub Actions"**
5. Save the settings

### Step 2: Push the GitHub Actions Workflow

The workflow file was created but needs to be pushed. Run these commands:

```bash
cd /Users/wilson/antigravity/project109

# Add SSH key or use HTTPS with token
git remote set-url origin https://github.com/wilsonwang0713/2026-trip-itinerary.git

# Push the workflow
git push origin main
```

**Alternative**: Manually upload `.github/workflows/deploy.yml` via GitHub web interface:

1. Go to your repo
2. Click "Add file" > "Create new file"
3. Name it: `.github/workflows/deploy.yml`
4. Copy the contents from `/Users/wilson/antigravity/project109/.github/workflows/deploy.yml`
5. Commit directly to main

### Step 3: Wait for Deployment

Once the workflow is pushed and Pages is enabled:

1. Go to the **"Actions"** tab in your repository
2. You'll see the deployment workflow running
3. Wait for it to complete (usually 2-3 minutes)

### Step 4: Access Your Site

Your site will be live at:
**`https://wilsonwang0713.github.io/2026-trip-itinerary/`**

## 📁 Project Structure

```
project109/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── components/                  # React components
│   ├── TimelineItem.tsx
│   ├── DaySection.tsx
│   ├── MapTrajectory.tsx
│   ├── WeatherWidget.tsx
│   ├── ThreeWeather.tsx
│   ├── HealingMessage.tsx
│   ├── LoginGate.tsx
│   ├── AddItemModal.tsx
│   └── RecommendationCard.tsx
├── App.tsx                      # Main app component
├── index.tsx                    # Entry point
├── index.html                   # HTML template
├── vite.config.ts              # Vite config (with base path)
├── package.json                 # Dependencies
├── firebaseUtils.ts            # Firebase utilities
├── firebase.json               # Firebase config
├── sw.js                       # Service worker
├── types.ts                    # TypeScript types
├── constants.tsx               # App constants
└── README.md                   # Documentation
```

## 🔧 Local Development

To run the app locally:

```bash
cd /Users/wilson/antigravity/project109

# Install dependencies
npm install

# Set your Gemini API key in .env.local
# GEMINI_API_KEY=your_key_here

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Features

- **Trip Itinerary Timeline**: Day-by-day schedule with activities
- **Interactive Map**: Leaflet map showing trip trajectory
- **Weather Widgets**: Current weather and 3D weather visualization (Three.js)
- **Firebase Integration**: User authentication and data persistence
- **PWA Support**: Service worker for offline functionality
- **Responsive Design**: Works on mobile, tablet, and desktop

## 🔑 Environment Variables

The app requires a Gemini API key. Set it in `.env.local`:

```
GEMINI_API_KEY=your_api_key_here
```

**Note**: For GitHub Pages deployment, you may need to set this as a GitHub Secret:

1. Go to Settings > Secrets and variables > Actions
2. Click "New repository secret"
3. Name: `GEMINI_API_KEY`
4. Value: Your API key

Then update the workflow to use it:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

## 📝 Deployment Workflow

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

1. Checks out the code
2. Sets up Node.js 20
3. Installs dependencies
4. Builds the Vite app
5. Uploads the `dist/` folder
6. Deploys to GitHub Pages

This runs on every push to the `main` branch.

## 🐛 Troubleshooting

### Workflow Not Running

- Check that Pages is enabled with "GitHub Actions" as source
- Verify the workflow file is in `.github/workflows/deploy.yml`
- Check the Actions tab for error messages

### Site Not Loading

- Ensure the base path in `vite.config.ts` matches your repo name
- Check browser console for errors
- Verify all assets are loading correctly

### Build Failures

- Check Node.js version (should be 20)
- Verify all dependencies are in `package.json`
- Check for TypeScript errors

## 🔗 Links

- **Repository**: https://github.com/wilsonwang0713/2026-trip-itinerary
- **Live Site**: https://wilsonwang0713.github.io/2026-trip-itinerary/ (after deployment)
- **Actions**: https://github.com/wilsonwang0713/2026-trip-itinerary/actions

---

**Created**: 2025-12-23  
**Status**: Ready for deployment (manual steps required)
