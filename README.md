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
git commit -m "Commit-Bootstrap, components, styles folder for .css, index.html SEO, About, Home, Portfolio" (I copy and paste this)
git status (tells us that everything is committed "working tree clean" on main branch)
git push
Now you can check repository for updated code.

# 4th Commit/lesson-Design, Contact pages

FRONTEND
folder: pages
Contact.jsx > added
Design.jsx > updated

main.jsx > updated with StoreProvider
Store.jsx > added
utils.jsx > added

nvm use 20
npm run dev
http://localhost:5173/

steps for fourth commit, ect: Open new terminal or command prompt in VSCode for the project root

git add . (space between add .)
git status (shows staged files ready to commit in green)
git commit -m "4th Commit/lesson-Design, Contact pages" (I copy and paste this)
git status (tells us that everything is committed "working tree clean" on main branch)
git push
Now you can check repository for updated code.

# 5th Commit/lesson-Backend (ESM), Admin, Messages, MongoDB setup

root: folder: .vscode
{}settings.json

BACKEND
NEW TERMINAL: mkdir backend > cd backend > npm init -y
npm install bcryptjs cors dotenv express express-async-handler jsonwebtoken mongoose multer nodemailer
npm install --save-dev nodemon
(backend we are using ex: server.js not server.jsx, .jsx is for the frontend)

folder: models
messageModel.js > added
userModel.js > added

folder: routes
messageRoutes.js > added
userRoutes.js > added

.env > added for connection > use .gitignore to prevent from pushing to github
.env.example > added

server.js > updated
{}package.json > updated

https://cloud.mongodb.com/
0.0.0.0/0 IP Access List
connect > drivers
mongodb+srv://gabudemy2:<db_password>@profile.fu1hnhf.mongodb.net/?appName=Profile
database access > password > password auth = qDT0vqVSu20X1szr (create your own password)

FRONTEND
comments removed and referenced by lesson at bottom of page
EX: // If you want to review the commented teaching version of the Contact.jsx setup, check commit lesson-04.

nvm use 20
npm run dev
http://localhost:5173/

control + c = stops server

** last example for steps to make a github commit **
steps for fifth commit, ect: Open new terminal or command prompt in VSCode for the project root

git add . (space between add .)
git status (shows staged files ready to commit in green)
git commit -m "5th Commit/lesson-Backend (ESM), Admin, Messages, MongoDB setup"
git status (tells us that everything is committed "working tree clean" on main branch)
git push
Now you can check repository for updated code.

# 6th Commit/lesson-Admin Signup, Signin, Messages, Upload seed data

BACKEND
folder: models
websiteModel.js > added
userModel.js > updated

folder: routes
seedRoutes.js > added
summaryRoutes.js > added
uploadRoutes.js > added
websiteRoutes.js > added
userRoutes.js > updated

data.js > added (seed the data)

server.js > updated added 4 routes

FRONTEND
folder: components
AdminPagination.jsx > added
AdminRoute.jsx > added
Header.jsx > updated

folder: pages
Messages.jsx > added

subfolder: pages/forms (new)
Signin.jsx > added
Signup.jsx > added

App.jsx > updated
main.jsx > updated pages
vite.config.js > updated

{}package.json > updated
npm install --force
nvm use 20
npm run dev
http://localhost:5173/

# 7th Commit/lesson-Profile, ForgetPassword, ResetPassword

FRONTEND
npm i react-react-google-charts --force

folder: components
ProtectedRoute.jsx > added

folder: pages
Dashboard.jsx > added
Header.jsx > comments added by lesson number

subfolder: forms
ForgetPassword.jsx > added
Profile.jsx > added
ResetPassword.jsx > added

main.jsx > updated with new pages
{}package.json > updated

# 8th Commit/lesson-Admin, Users

FRONTEND
folder: components
AdminPagination.jsx > updated

folder: pages > subfolder > admin
Dashboard.jsx > moved into admin subfolder
Messages.jsx > moved into admin subfolder
UserEdit.jsx > added
UserList.jsx > added

main.jsx > updated, pages > added admin pages, updated forms

# 9th Commit/lesson-Websites

BACKEND server.js > updated app.use('/api/websites', websiteRouter); > website to websites

FRONTEND
folder: pages > admin
UserList.jsx > updated
WebsiteEdit.jsx > added
WebsiteList.jsx > added

main.jsx > updated with WebsiteList.jsx, WebsiteEdit.jsx

# 10th Commit/lesson-Image upload

BACKEND
folder: routes
uploadRoutes.js > updated

uploads folder added in root (images)

server.js > updated with uploads

FRONTEND
public
site.webmanifest > added
{
// Full name of the app as it appears on install prompts
"name": "My Portfolio",

// Short name shown under the app icon when installed
"short_name": "Portfolio",

// The URL that loads when the app is opened from home screen
"start_url": "/",

// "standalone" makes the site open like a mobile app
// (no browser UI, no address bar)
"display": "standalone",

// Icons used when installed as a PWA.
// Empty for now — you can add 192x192 and 512x512 icons later.
"icons": []
}

folder: public
images > added

folder: components
WebsiteCard.jsx > updated

folder: pages/admin
WebsiteEdit.jsx > updated
WebsiteList.jsx > updated

styles > portfolio.css > updated for images

utils.jsx > updated
vite.config > updated
