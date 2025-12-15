# Udemy-Vite-Portfolio

cd desktop
mkdir Udemy-Vite-Portfolio
cd Udemy-Vite-Portfolio
PASTE FROM GITHUB IN TERMINAL:
echo "# Udemy-Vite-Portfolio" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/castrogabe/Udemy-Vite-Portfolio.git
git push -u origin main

# 2nd Commit-Vite setup Portfolio frontend, basic pages, footer, header, modify .gitignore

cd Udemy-Vite-Portfolio
\*\*\* important make sure you are using node version 20
nvm use 20
npm run dev

Create Vite Project
npm create vite@latest frontend

use up and down arrows to select (clicking radial buttons may not work)

> npx
> create-vite frontend

│
◇ Select a framework:
│ React
│
◇ Select a variant:
│ JavaScript + SWC
│
◇ Use rolldown-vite (Experimental)?:
│ No
│
◇ Install with npm and start now?
│ Yes
│
◇ Scaffolding project in /Users/gabrielcastro/Desktop/Udemy-Vite-Portfolio/frontend...
│
◇ Installing dependencies with npm...

VITE v7.2.7 ready in 1477 ms

➜ Local: http://localhost:5173/
➜ Network: use --host to expose
➜ press h + enter to show help

npm install react-router-dom react-toastify bootstrap typewriter-effect
npm remove @types/react @types/react-dom
npm install --legacy-peer-deps

frontend/
├── src/
│ ├── components/
│ │ ├── Header.jsx
│ │ ├── Footer.jsx
│ │ └── ...
│ └── pages/
│ ├── About.jsx
│ ├── Design.jsx
│ ├── Home.jsx
│ ├── Portfolio.jsx
│ └── NotFound.jsx
├── index.css
├── App.jsx
└── main.jsx

.gitignore (root)

// rfc <= this is the one we are using in the lessons import react from 'react';
export default function Home () { Return {
Home } };

FRONTEND
folder: components
Header.jsx > added
Footer.jsx > added

folder: pages
About.jsx > added
Design.jsx > added
Home.jsx > added
NotFound.jsx > added
Portfolio.jsx > added

steps for second commit, ect: Open new terminal or command prompt in VSCode for the project root

git add . (space between add .)
git status (shows staged files ready to commit in green)
git commit -m "2nd Commit add static data and steps for second commit" (I copy and paste this)
git status (tells us that everything is committed "working tree clean" on main branch)
git push
Now you can check repository for updated code.

# 3rd Commit-Bootstrap, components, styles folder for .css, index.html SEO, About, Home, Portfolio

nvm use 20
npm run dev

FRONTEND
folder: components
BottomFooter.jsx > added
Footer.jsx > updated
Header.jsx > updated
Pagination.jsx > added
Jumbotron.jsx > added
LoadingBox.jsx > added
MessageBox.jsx > added
Pagination.jsx > added
WebsiteCard.jsx > added

folder: pages
About.jsx > updated
Home.jsx > updated
Portfolio.jsx > updated

index.html > updated, fontawesome, SEO, images (replace with your own)

** Get the full width of the application across the desktop **
App.css > delete
App.jsx > delete App.css

folder: styles
index.css > updated with links to individual pages and components
{}package.json > updated with react-helmet-async --legacy-peer-deps

nvm use 20
npm run dev

steps for third commit, ect: Open new terminal or command prompt in VSCode for the project root

git add . (space between add .)
git status (shows staged files ready to commit in green)
git commit -m "2nd Commit add static data and steps for second commit" (I copy and paste this)
git status (tells us that everything is committed "working tree clean" on main branch)
git push
Now you can check repository for updated code.
