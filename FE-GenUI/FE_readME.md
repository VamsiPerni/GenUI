# 🎨 FE-GenUI — Frontend of GenUI

This is the frontend of GenUI — a modern, AI-assisted React component generator with chat-based interaction, session management, and preview support.

## 📁 Folder Structure

```
└── 📁FE-GenUI
    └── 📁src
        └── 📁assets
        └── 📁axios
            ├── axiosInstance.js
        └── 📁components
            ├── chatSideBar.jsx
            ├── codeInspector.jsx
            ├── componentPreview.jsx
            ├── footer.jsx
            ├── navbar.jsx
            ├── sessionDetail.jsx
            ├── sessionManager.jsx
            ├── sessionManagerHome.jsx
        └── 📁contexts
            ├── appContext.jsx
        └── 📁pages
            ├── HomePage.jsx
            ├── LoginPage.jsx
            ├── NotFoundPage.jsx
            ├── ProfilePage.jsx
            ├── SessionPage.jsx
            ├── SignupPage.jsx
        └── 📁utils
            ├── toastHelper.js
        ├── App.jsx
        ├── index.css
        ├── main.jsx
    ├── .env
    ├── .env.example
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── vercel.json
    └── vite.config.js
```


## 🚀 How to Run

### Make sure your .env file is correctly set up based on .env.example

```bash
cd FE-GenUI
npm install
npm run dev
