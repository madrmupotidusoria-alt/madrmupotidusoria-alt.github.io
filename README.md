# SCANORA Intelligence Frontend

Professional OSINT platform with stunning aurora background effects.

## 🌟 Features

- **WebGL Aurora Background** - Dynamic northern lights animation
- **Professional UI** - Dark theme with blue accents
- **Responsive Design** - Mobile-optimized layout
- **Interactive Elements** - Hover effects and smooth transitions
- **Modern Typography** - Orbitron font family

## 🚀 GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages.

### Automatic Deployment:
1. Push changes to `main` branch
2. GitHub Actions will automatically deploy to GitHub Pages
3. Site will be live at: `https://[username].github.io/[repository-name]/`

### Manual Setup:
1. **Enable GitHub Pages:**
   - Go to repository settings → Pages
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Save settings

2. **GitHub Actions:**
   - The `.github/workflows/deploy.yml` handles automatic deployment
   - Triggers on push to main branch
   - No build step needed for static HTML

## 🛠️ Technologies

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with backdrop filters
- **JavaScript** - WebGL aurora effects
- **WebGL** - GPU-accelerated graphics
- **Google Fonts** - Orbitron typography

## 📁 Project Structure

```
frontend/
├── index.html          # Main page with aurora effect
├── aurora.html         # Standalone aurora demo
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Pages deployment
└── README.md           # This file
```

## 🎨 Aurora Effect

The aurora background uses:
- **Perlin Noise** for realistic movement
- **Color Gradients** for northern lights effect
- **WebGL Shaders** for GPU acceleration
- **Responsive Canvas** for all screen sizes

## 🔧 Customization

### Aurora Colors:
Edit the `colorStops` array in the JavaScript:
```javascript
const colorStops = ['#5227FF', '#7cff67', '#5227FF'];
```

### Animation Speed:
Adjust the time multiplier:
```javascript
gl.uniform1f(timeLocation, time * 0.001);
```

## 📱 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 🌐 Deployment Commands

```bash
# Initialize git if needed
git init
git add .
git commit -m "Initial commit: SCANORA frontend with aurora"

# Add remote (replace with your repo)
git remote add origin https://github.com/[username]/[repository].git

# Push to trigger deployment
git push -u origin main
```

---

© 2026 Scanora Intelligence | Ethical OSINT Framework

1. Install dependencies

```bash
cd frontend
npm install
```

2. Run dev server

```bash
npm run dev
```

3. Build for production

```bash
npm run build
npm run preview
```

If you prefer the CDN/no-build approach, the previous `index.html` was replaced with a Vite entry — I can revert if you want.
