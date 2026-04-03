# Ibrahim A. Soliman - Portfolio Setup

## Quick Start

```bash
# Clone repository
git clone git@github.com:ibrahim-shoil/myportfolio.git
cd myportfolio

# Install dependencies
npm install

# Build for production
npm run build

# The dist/ folder contains the production files
```

## Deployment

The site is already deployed at: https://ishoil.me

To update after making changes:

```bash
# Build
npm run build

# Restart nginx
sudo systemctl reload nginx

# ALWAYS commit and push to GitHub after deploying
git add -A
git commit -m "descriptive message here"
git push origin main
```

**IMPORTANT**: After every set of changes, you MUST push to GitHub. Do not skip `git push`.

## Tech Stack

- React + Vite
- SCSS for styling
- Deployed on VPS with Nginx
- Domain: ishoil.me

## Project Structure

```
src/
├── components/     # React components
├── styles/        # SCSS variables and global styles
└── App.jsx        # Main app with theme toggle
```

## Features

- Full Stack Engineer & DevOps portfolio
- Terminal interface with autocomplete
- Mobile responsive
- Light/dark theme toggle
- Favicon (is_logo.png)

## Commands

Terminal commands available:
- `help` - Show available commands
- `projects` - List all projects
- `project <slug>` - View project details
- `about` - Professional background
- `contact` - Contact information
- `clear` - Clear terminal
- Ctrl+C - Stop command

## Contact

- Email: ishoil@icloud.com
- WhatsApp: +20 011 2399 4906

## GitHub

github.com/ibrahim-shoil/myportfolio
