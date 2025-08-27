# Production Setup Guide

## Environment Variables for Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=your-neon-connection-string
ADMIN_PASSWORD=your-secure-password  
NEXTAUTH_SECRET=random-32-character-secret
NEXTAUTH_URL=https://your-app.vercel.app
```

## Database Setup Commands

Run these commands to set up your production database:

```bash
# Set the production database URL temporarily
export DATABASE_URL="your-neon-connection-string"

# Push the schema to production database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed the database with categories and sample data
npm run db:seed
```

## Generate Secrets

For NEXTAUTH_SECRET, use:
```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32
