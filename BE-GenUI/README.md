### ✅ Backend `README.md` (`BE-GenUI/README.md`)

# 🧠 BE-GenUI — Backend of GenUI

This is the backend for GenUI — built using Node.js, Express.js, MongoDB, and the Gemini API. It provides authentication, session management, AI-based code generation, and user data handling.

## 📁 Folder Structure
```
└── 📁BE-GenUI
    └── 📁api
        └── 📁v1
            └── 📁auth
                ├── controller.js
                ├── dto.js
                ├── routes.js
            └── 📁llm
                ├── controller.js
                ├── routes.js
            └── 📁sessions
                ├── controller.js
                ├── routes.js
            └── 📁users
                ├── controllers.js
                ├── routes.js
            ├── middleware.js
            ├── routes.js
    └── 📁config
        ├── aiclient.js
        ├── cloudinary.js
        ├── db.js
    └── 📁models
        ├── otpSchema.js
        ├── sessionSchema.js
        ├── userSchema.js
    └── 📁uploads
        ├── bc8c361eebabc34c100ffd40d1e96afe
    └── 📁utils
        ├── controllerHelpers.js
        ├── emailHelpers.js
        ├── jwtHelpers.js
    ├── .env
    ├── .env.example
    ├── .gitignore
    ├── app.js
    ├── package-lock.json
    └── package.json
```


## 🚀 How to Run

### Make sure your .env file is correctly set up based on .env.example

```bash
cd FE-GenUI
npm install
nodemon app.js
