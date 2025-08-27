# UploadThing Setup for Image Uploads

## Step 1: Get UploadThing Token

1. Go to https://uploadthing.com
2. Sign up with GitHub
3. Create a new app
4. Go to your app's API Keys page
5. Copy the full token (it's a long base64 string that contains apiKey, appId, and regions)

## Step 2: Add Environment Variable

Add this single environment variable to your Vercel:

```
UPLOADTHING_TOKEN=eyJhcGlLZXkiOiJza...  (the full base64 token from UploadThing)
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
