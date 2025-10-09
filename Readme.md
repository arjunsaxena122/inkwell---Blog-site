# 📰 Inkwell – Blog Publishing API with Admin Approval Flow

- Inkwell is a REST API for a blogging platform where users can create blog posts, but posts must be approved by an admin before being published.

- This project demonstrates content moderation, approval workflows, and role-based access control (admin vs regular user).

## 🚀 Tech Stack

- Node.js + Express.js – Server and routing

- MongoDB + Mongoose – Database and schema modeling

- JWT (JSON Web Tokens) – Authentication & Authorization

- bcrypt.js – Secure password hashing

## 🧩 API Overview

### 🔐 Auth & API Key:

- POST /auth/register → Register as regular user
- POST /auth/login → Login with credentials
- POST /auth/api-key → Generate API key
- GET /auth/me → Get current user details

## 📝 Post Routes:

- POST /posts → Create a blog post (default status: “pending”)
- GET /posts → List published posts (public)
- GET /posts/:id → View published post
- PUT /posts/:id → Edit a post (only by author, if not approved)
- DELETE /posts/:id → Delete a post (only by author, if not approved)

## 🔎 Admin Post Review Routes:

- GET /admin/posts → List all pending posts
- PUT /admin/posts/:id/approve → Approve a post
- PUT /admin/posts/:id/reject → Reject with optional comment

## 🏷️ Category Routes:

- POST /categories → Add a new category (admin)
- GET /categories → List all categories

## 🔄 Post Status Flow

Blog post has a status field:

- pending (default)
- approved
- rejected
- Only approved posts are public. Rejected posts can be edited and resubmitted

## ⚙️ Project Setup

### 1. Clone the Repository

```bash
https://github.com/arjunsaxena122/inkwell---Blog-site.git
cd inkwell---Blog-site
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

- Duplicate .env.example as .env and update the values as needed.

### 4. Run the Server

```bash
pnpm run dev
```

Server will start on http://localhost:3000

## 🎯 End Goal

To create a fully working Express.js API that supports:

- Fully working Express.js API to create, review, approve, and publish blog posts
- Role-based auth (user vs admin)
- JWT authentication + API Key system
- Proper CRUD for blog posts and categories
- Postman collection with full testing flow (including approval steps)
- Modular production-ready code
