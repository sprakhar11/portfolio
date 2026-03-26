# Prakhar's Developer Portfolio

A modern, visually unique, and static React.js developer portfolio built with Vite. The website features a minimal, futuristic dark-themed UI with high-quality animations, smooth scrolling, 3D elements, and dynamic data integration for GitHub repositories and resume highlights.

## Features

- **Modern Tech Stack**: React (latest), Vite, Tailwind CSS V4
- **Animations & 3D**: Framer Motion for UI animations, Three.js & React Three Fiber for dynamic hero particles
- **Smooth Navigation**: Lenis custom smooth scrolling
- **Dynamic Content**: GitHub API integration to fetch and display top repositories dynamically
- **Interactive UI**: Magnetic buttons, custom animated cursor, hover card tilts
- **Responsive Design**: Fully optimized for Mobile, Tablet, and Desktop
- **Admin Panel**: Secure browser-based admin panel to manage all site content
- **Anonymous Messaging**: Visitors can send anonymous messages via EmailJS integration

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

### Site Config (`src/config/siteConfig.js`)

Core portfolio metadata and toggle settings:

| Field | Description |
|---|---|
| `name`, `role`, `email` | Profile information |
| `githubUsername`, `linkedin`, `twitter` | Social links |
| `description` | Bio displayed in the hero section |
| `showSkills` | Toggle Skills section visibility |
| `showExperience` | Toggle Experience section visibility |
| `showAchievements` | Toggle Achievements section visibility |
| `showProjects` | Toggle Projects (GitHub repos) section visibility |
| `showContact` | Toggle Contact section visibility |
| `enableEmailService` | Toggle the anonymous "Say Hello" email button |
| `enableResumeDownload` | Toggle the floating resume download button |

All toggle fields default to `true`. Set any to `false` to hide the corresponding section or feature.

### Data Files

- **`src/data/achievements.js`** — Experience, education, and achievements data
- **`src/data/skills.js`** — Skill categories and items with icon mappings

## Admin Panel

Access the admin panel at `/admin`. It uses GitHub Personal Access Token (PAT) authentication to commit changes directly to the repository.

### Features

| Tab | What you can manage |
|---|---|
| **Site Config** | Profile info, section visibility toggles, feature toggles |
| **Skills** | Skill categories and individual skills (name, icon, color) |
| **Experience** | Work experience entries with bullet points |
| **Education** | Education entries |
| **Achievements** | Achievement cards with icons |
| **Resume** | Upload/replace resume PDF |

### How It Works

1. Navigate to `your-site.com/admin`
2. Enter your GitHub PAT (needs `repo` scope)
3. Edit any content through the admin UI
4. Click **Save & Deploy** — changes are committed directly to the `main` branch
5. GitHub Actions automatically rebuilds and deploys the site

### Skills Management

The Skills editor lets you manage skill categories (Languages, Tools & Frameworks, Soft Skills, etc.) and individual skills within each category. For each skill, specify:

- **Skill Name** — Display name (e.g., "Java", "Redis")
- **Icon Library** — Source library: Font Awesome (`fa`), Simple Icons (`si`), VS Code Icons (`vsc`), or Lucide (`lucide`)
- **Icon Name** — The exact component name (e.g., `FaJava`, `SiRedis`, `Lightbulb`)
- **Color Class** — Tailwind color class (e.g., `text-orange-500`)

### Section Toggles

Toggle individual sections on/off from the **Site Config** tab without deleting any data. Sections include: Skills, Experience, Achievements, Projects, and Contact.

### Feature Toggles

- **Email Service** — Show/hide the floating "Say Hello" button
- **Resume Download** — Show/hide the floating resume download button

## GitHub Pages Deployment

This project is explicitly optimized to be deployed as a static site (e.g., GitHub Pages).

1. Update `vite.config.js` with your repository base path if deploying to a sub-path (`base: '/repo-name/'`).
2. Run `npm run build`
3. Push the `dist/` directory to your `gh-pages` branch, or configure GitHub Actions to deploy the Vite build automatically.

Using GitHub Actions (Recommended):
Create `.github/workflows/deploy.yml` using the official Vite deployment template.
