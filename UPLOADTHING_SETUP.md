# UploadThing Setup for Image Uploads

## Step 1: Get UploadThing API Keys

1. Go to https://uploadthing.com
2. Sign up with GitHub
3. Create a new app
4. Copy your API keys

## Step 2: Add Environment Variables

Add these to your Vercel environment variables:

```
UPLOADTHING_TOKEN=sk_live_...
UPLOADTHING_APP_ID=your_app_id
```

## Step 3: That's it!

Your image uploads will now work on Vercel!

The free tier includes:
- 2GB storage
- 100GB bandwidth
- Perfect for your MVP

## Local Development

For local development, you can still use file uploads.
The code automatically falls back to local storage when UploadThing vars aren't available.
