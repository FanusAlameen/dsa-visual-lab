# DSA Visual Lab

A beginner-friendly React + Vite site for learning data structures and algorithms through interactive visualizations.

## Run locally

1. Install Node.js (LTS) from https://nodejs.org/.
2. Open this project folder in a terminal.
3. Install packages:

   ```bash
   npm install
   ```

4. Start the local development server:

   ```bash
   npm run dev
   ```

5. Open the local URL Vite prints in your terminal (usually http://localhost:5173).

## Add this to your GitHub repository

1. Create a GitHub repository named `dsa-visual-lab` (or choose another name).
2. If you choose a different name, update `base` in `vite.config.js` to `'/YOUR-REPOSITORY-NAME/'`.
3. From this project folder, run:

   ```bash
   git init
   git add .
   git commit -m "Create DSA Visual Lab starter"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/dsa-visual-lab.git
   git push -u origin main
   ```

   Replace `YOUR-USERNAME` with your GitHub username. If you created a repository with a different name, update the URL too.

## Enable GitHub Pages

1. On GitHub, open your repository and go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. The included `.github/workflows/deploy.yml` builds the Vite app and publishes the `dist` folder whenever you push to `main`.
4. Open the **Actions** tab and wait for **Deploy DSA Visual Lab to GitHub Pages** to finish successfully.
5. Go back to **Settings → Pages** to find your published URL. It will look like `https://YOUR-USERNAME.github.io/dsa-visual-lab/`.

## Project structure

```text
dsa-visual-lab/
├── .github/workflows/deploy.yml  # Automatically build and publish to Pages
├── index.html                   # Browser entry HTML
├── package.json                 # Dependencies and commands
├── vite.config.js                # Vite config and Pages base URL
└── src/
    ├── main.jsx                  # Starts the React app
    ├── App.jsx                   # Main app component
    ├── styles.css                # Site styling
    ├── components/
    │   └── TopicCard.jsx         # Reusable topic card
    ├── data/
    │   └── topics.js             # Topic list and lesson metadata
    ├── pages/
    │   └── Home.jsx              # Landing page
    └── visualizations/
        └── FindMaxLength.jsx     # Interactive lesson component
```

## Add future lessons

- Add a new visualization component under `src/visualizations/`, e.g. `TwoSum.jsx`.
- Add its topic or lesson metadata in `src/data/topics.js`.
- Import and display the component from `src/pages/Home.jsx` (or make a dedicated page when the collection grows).
- Test locally with `npm run dev`, then push your changes. GitHub Actions republishes the site automatically.

## Important

GitHub Pages publishes a public website. Do not commit passwords, API keys, tokens, private notes, or other secrets.
