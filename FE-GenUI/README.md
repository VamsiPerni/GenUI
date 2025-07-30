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

```

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

