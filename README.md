# pulsiveblog: Professional Headless CMS Platform

pulsiveblog is a high-performance, developer-centric headless content management system. It provides a robust REST API for delivering content to any frontend, combined with a secure management dashboard.

## System Architecture

The platform is built on a modern stack ensuring scalability and security:
- Backend: Node.js with Express 4
- Database: MongoDB (Atlas) with Mongoose
- Storage: Cloudinary for optimized media delivery
- Auth: GitHub OAuth 2.0 with JWT session management
- Security: Per-user API Key isolation

## Core Features

### Multi-User Isolation
Every user account operates in a private workspace. Posts, media, and settings are strictly scoped to the authenticated user.

### Automation Webhooks
The platform supports outbound webhooks. You can configure a target URL (e.g., Vercel or Netlify deploy hooks) that receives a POST request whenever content is created, updated, or deleted.

### Developer API
A clean RESTful API allows for seamless content integration:
- Authentication via X-API-KEY header
- Support for filtering by tags
- Automated slug generation
- JSON response format

### SEO and Social Management
Dedicated fields for meta titles, meta descriptions, and OpenGraph images allow for fine-tuned search engine and social media optimization.

## API Documentation

### Authentication
Include your API key in the request header:
`X-API-KEY: your_private_key`

### v1 Endpoints

#### Get All Posts
`GET /api/v1/posts`
Query Parameters:
- `tag`: Filter by specific tag
- `status`: Default is 'published'. Use 'all' to retrieve both drafts and published posts.
- `page`: Pagination page (default: 1)
- `limit`: Items per page (default: 10). Use 'all' to fetch the entire collection without pagination.

#### Get Single Post
`GET /api/v1/posts/:identifier`
The identifier can be the MongoDB ObjectID or the URL slug.

## Deployment

### Environment Variables
The following variables are required for deployment:
- `MONGODB_URI`: Your MongoDB connection string
- `GITHUB_CLIENT_ID`: GitHub OAuth Client ID
- `GITHUB_CLIENT_SECRET`: GitHub OAuth Client Secret
- `JWT_SECRET`: Secure string for token signing
- `CLOUDINARY_URL`: Cloudinary connection string
- `CALLBACK_URL`: Your production callback URL (e.g., https://your-app.vercel.app/api/v1/auth/github/callback)

### Vercel Configuration
The project includes a `vercel.json` for zero-configuration deployment. Ensure that the 'trust proxy' setting is enabled in the server initialization for proper session handling in serverless environments.

## Development

1. Install dependencies:
   `npm install`

2. Start the development server:
   `npm start`

3. Access the dashboard:
   Navigate to `localhost:8080/dashboard.html`

The system automatically manages database connection health and provides graceful error handling for serverless cold starts.
