# Pulsiveblog Backend API

This is the Express.js REST API that powers the Pulsiveblog platform. It securely handles GitHub OAuth flows, encrypts tokens via AES-256-GCM, and interacts with user repositories.

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- Octokit (GitHub REST API Client)
- JSON Web Tokens (JWT)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)
- GitHub OAuth Application

### Installation

1. Navigate to the backend directory:
   cd backend
2. Install dependencies:
   npm install

### Configuration

Copy the example environment file:
cp .env.example .env

Update the variables in `.env` with your specific configuration:
- PORT: The port the server will run on (default 8080).
- NODE_ENV: Set to development or production.
- CLIENT_URL: The URL of your frontend application.
- MONGODB_URI: Connection string for your MongoDB database.
- CLIENT_ID: GitHub OAuth Client ID.
- CLIENT_SECRET: GitHub OAuth Client Secret.
- CALLBACK_URL: The OAuth redirect URI.
- JWT_SECRET: Secret key for signing JSON Web Tokens.
- ENCRYPTION_KEY: 32-byte key used for encrypting GitHub Access Tokens.

### Running the Server

To start the server in development mode with automatic restarts:
npm run dev

To start the server in production mode:
npm start

## Core API Endpoints

- /api/auth: Authentication flows (login, logout, user profile validation, GitHub linking).
- /api/posts: Private repository interaction endpoints (create, update, delete posts, and push raw media via base64 encoding).
- /api/public/posts: Aggregated public community feed routing mechanism retrieving live GitHub network objects.
