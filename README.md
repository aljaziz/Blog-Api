# 📝 Blog API

A **secure, scalable, and feature-rich Blog REST API** built with **Node.js, Express, TypeScript, and MongoDB**.  
It includes **JWT authentication** (Access & Refresh Tokens with HttpOnly cookies), **SEO-friendly blog post slugs**, and full **CRUD operations** with **validation, pagination, filtering, and search** capabilities.

---

## 🚀 Features

### 🔐 Authentication & Authorization

-   JWT-based **Access & Refresh Token** authentication
-   Tokens stored securely in **HttpOnly cookies**
-   User registration, login, and logout
-   Middleware-protected routes for authenticated users

### 👤 User Management

-   Update user profile (username, email, password, etc.)
-   Delete user account
-   Role-based route protection

### 📰 Blog Post Management

-   Full **CRUD operations** (Create, Read, Update, Delete)
-   Automatically generated **SEO-friendly slugs**
-   Pagination, filtering, and search support
-   Validation using **express-validator**

### ⚙️ Developer Features

-   **TypeScript** for type safety and maintainability
-   Organized folder structure following MVC architecture
-   Centralized error handling middleware
-   MongoDB & Mongoose for schema modeling
-   Clean and reusable utility functions

---

## 🏗️ Tech Stack

| Technology             | Description                |
| ---------------------- | -------------------------- |
| **Node.js**            | Runtime environment        |
| **Express.js**         | Web framework              |
| **TypeScript**         | Type-safe JavaScript       |
| **MongoDB + Mongoose** | NoSQL database & ORM       |
| **JWT**                | Authentication mechanism   |
| **Express-Validator**  | Input validation           |
| **Helmet**             | HTTP header security       |
| **Compression**        | Response size optimization |
| **Express-Rate-Limit** | Request rate limiting      |
| **HttpOnly Cookies**   | Secure token storage       |

---

## 📁 Project Structure

```bash
blog-api/
├── src/
| ├── @types/
│ ├── config/
│ ├── controllers/
│ ├── lib/
│ ├── middlewares/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ └── server.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/aljaziz/Blog-Api.git
cd Blog-Api

```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create a .env file in the root directory and add:

```env
PORT=3000
NODE_END=development
MONGO_URI=your_mongo_uri
LOG_LEVEL=info
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=1w
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api
CLOUDINARY_API_SECRET=your_cloudinary_secret

```

### 4️⃣ Run the Server

Development Mode (with Hot Reload)

```bash
npm run dev
```

Production Build

```bash
npm run build
npm start
```

## 🔒 Security

-   Tokens stored in HttpOnly cookies (protects against XSS)

-   Passwords hashed with bcrypt

-   Rate limiting to block abusive requests

-   Input sanitization with express-validator

-   Secure headers via Helmet

-   Environment variables managed with .env

## 🧪 Future Improvements

- Add Swagger or Postman documentation

- Rate limit based on user/IP

- Unit & integration tests using Jest or Vitest