# pulsiveblog API Documentation (v1)

Welcome to the **pulsiveblog** Developer API. This document covers how to integrate your content into any frontend application.

## Authentication

All API requests require your private API Key. You can find or regenerate your key in the **Settings** modal of your dashboard.

### Header Method (Recommended)
Include the key in your HTTP headers:
`X-API-KEY: pb_your_secret_key_here`

### Query Parameter Method
Alternatively, append it to your URL:
`?api_key=pb_your_secret_key_here`

---

## Endpoints

### 1. Get All Posts
Retrieve a collection of your stories.

**URL**: `GET /api/v1/posts`

**Query Parameters**:
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `status` | string | `published` | `published`, `draft`, or `all` |
| `tag` | string | - | Filter by a specific tag |
| `search` | string | - | Search titles and content |
| `page` | number | `1` | Pagination page |
| `limit` | number/string | `10` | Number of items or `all` for full fetch |

**Example**:
`GET /api/v1/posts?limit=all&status=all`

---

### 2. Get Single Post
Retrieve a specific post by its ID or friendly URL slug.

**URL**: `GET /api/v1/posts/:identifier`

**Path Parameters**:
- `identifier`: Either the MongoDB `_id` or the post `slug`.

**Example**:
`GET /api/v1/posts/my-first-blog`

---

### 3. Create a Post
Create a new story programmatically. Supports both HTML and Markdown.

**URL**: `POST /api/v1/posts`

**Request Body** (JSON):
```json
{
  "title": "My New Post",
  "content": "## Hello World\nThis is my content.",
  "status": "published",
  "tags": ["tech", "nodejs"],
  "author": "Kennedy",
  "metaTitle": "SEO Optimized Title",
  "metaDescription": "Brief description for search engines"
}
```

---

## Webhooks

The system triggers a POST request to your configured **Webhook URL** whenever content changes.

### Event Types
- `post_created`
- `post_updated`
- `post_deleted`

### Payload Structure
```json
{
  "source": "pulsiveblog",
  "action": "post_created",
  "timestamp": "2026-02-26T10:00:00Z",
  "post": { ... }
}
```

---

## Security & Limits

- **Rate Limiting**: 100 requests per 15 minutes per IP/API Key.
- **Isolation**: You can only access posts owned by your account.
- **Media**: All images are served via Cloudinary's CDN for maximum performance.
