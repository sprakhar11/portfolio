# Prakhar's Developer Portfolio

A modern, visually unique, and static React.js developer portfolio built with Vite. The website features a minimal, futuristic dark-themed UI with high-quality animations, smooth scrolling, 3D elements, and dynamic data integration for GitHub repositories and resume highlights.

## Features

- **Modern Tech Stack**: React (latest), Vite, Tailwind CSS V4
- **Animations & 3D**: Framer Motion for UI animations, Three.js & React Three Fiber for dynamic hero particles
- **Smooth Navigation**: Lenis custom smooth scrolling
- **Dynamic Content**: GitHub API integration to fetch and display top repositories dynamically
- **Interactive UI**: Magnetic buttons, custom animated cursor, hover card tilts
- **Responsive Design**: Fully optimized for Mobile, Tablet, and Desktop

## Setup & Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```
2. **Run Development Server**
   ```bash
   npm run dev
   ```
3. **Build for Production**
   ```bash
   npm run build
   ```
4. **Preview Production Build locally**
   ```bash
   npm run preview
   ```

## Configuration

Edit core portfolio metadata and GitHub integration settings in `src/config/siteConfig.js`. 
To modify your parsed achievements, edit `src/data/achievements.js`.

## GitHub Pages Deployment

This project is explicitly optimized to be deployed as a static site (e.g., GitHub Pages).

1. Update `vite.config.js` with your repository base path if deploying to a sub-path (`base: '/repo-name/'`).
2. Run `npm run build`
3. Push the `dist/` directory to your `gh-pages` branch, or configure GitHub Actions to deploy the Vite build automatically.

Using GitHub Actions (Recommended):
Create `.github/workflows/deploy.yml` using the official Vite deployment template.
