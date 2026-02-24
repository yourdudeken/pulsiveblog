# pulsiveblog: The Headless CMS for Developers

pulsiveblog is a modern, lightweight, and secure headless content management system specifically engineered for developer workflows. It focuses on zero-friction content management by leveraging tools that developers already use and love, such as GitHub and Cloudinary.

## Core Philosophy

- Developer Centric: No complex interfaces. Single-click sign-in with GitHub and immediate access to a clean management dashboard.
- Headless First: Your content is delivered via a high-performance JSON API, ready to be consumed by any frontend framework (Next.js, Vite, etc.) or static site generator.
- Robust Media: Integrated Cloudinary support ensures your images are permanently hosted, globally distributed, and automatically optimized.
- Secure by Design: Protected by GitHub OAuth and secured with personal API keys for all programmatic data access.

## Features

- Native GitHub Authentication: No additional passwords. Secure session management via GitHub identities.
- API Key Security: Every user account is secured with a unique API key (pb_*) required for all content fetching and management.
- RESTful API v1: Clean, predictable versioned endpoints following industry standards.
- Integrated Media Manager: Direct-to-Cloudinary image uploads with automatic responsive resizing.
- Rich Text Management: Elegant editing experience via Quill integration with real-time HTML/JSON generation.
- Responsive Dashboard: A premium manager interface that works seamlessly on desktop and mobile.

## Getting Started

### Local Development

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Create a .env file in the root directory and provide:
   - MONGODB_URI (Your MongoDB Atlas connection string)
   - CLIENT_ID (GitHub OAuth App Client ID)
   - CLIENT_SECRET (GitHub OAuth App Client Secret)
   - JWT_SECRET (A random secure string for token signing)
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
   - CALLBACK_URL (Default: http://localhost:8080/api/v1/auth/github/callback)

3. Start the development server:
   ```bash
   npm start
   ```

### Vercel Deployment

pulsiveblog is pre-configured for Vercel deployment.

1. Connect your repository to Vercel.
2. Add all environment variables listed above to the Vercel Dashboard.
3. Update your GitHub OAuth callback URL to your Vercel deployment URL (e.g., https://your-project.vercel.app/api/v1/auth/github/callback).
4. Deploy.

## API v1 Reference

All endpoints are prefixed with /api/v1.

### Authentication

Public content fetching requires your personal API key. Management actions require either a valid JWT session or the API key passed in the headers.

Header: `X-API-KEY: your_api_key`
Query Param: `?api_key=your_api_key`

### 1. Fetch All Posts
`GET /api/v1/posts`

Query Parameters:
- tag: Filter by specific tag.
- page: Pagination page (default: 1).
- limit: Results per page (default: 10).
- status: published or draft (default: published).

### 2. Fetch Single Post
`GET /api/v1/posts/:identifier`

- identifier can be the post _id or the unique slug.

### 3. Management Endpoints
- POST /api/v1/posts: Create a new post.
- PUT /api/v1/posts/:id: Update an existing post.
- DELETE /api/v1/posts/:id: Delete a post.

## Frontend Integration Example

```javascript
async function getPulsiveContent() {
    const apiKey = 'your_pulsive_api_key';
    const res = await fetch('https://your-app.vercel.app/api/v1/posts', {
        headers: { 'X-API-KEY': apiKey }
    });
    const data = await res.json();
    return data.posts;
}
```

## Security Notice

Always keep your API keys and GitHub Client Secrets confidential. When deploying to production, ensure MONGODB_URI is restricted to specific Vercel IPs or whitelisted in MongoDB Atlas.

## License

This project is licensed under the ISC License.
