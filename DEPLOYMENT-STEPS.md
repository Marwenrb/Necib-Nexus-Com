# Necib Nexus - Deployment Steps

## The Issues Fixed

1. **Duplicate Package Resolution**
   - Multiple versions of `scheduler` (0.21.0 and 0.23.2)
   - Multiple versions of `zustand` (3.7.2, 4.5.6, and 5.0.3)
   - Fixed by adding package overrides in package.json

2. **Static Export Limitation**
   - Removed `output: 'export'` from next.config.js
   - This was de-optimizing Next.js features, including API routes

3. **Image Configuration**
   - Removed `unoptimized: true` setting from next.config.js
   - This allows proper image optimization

4. **Environment Variables**
   - Updated API routes to properly use environment variables
   - Added error handling for missing environment variables

## Deployment Steps

### 1. Clean up and prepare

```bash
# Clean up any previous build artifacts
node cleanup.js
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables on Vercel

Set these in your Vercel project settings:

- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
- `NEXT_PUBLIC_EMAILJS_USER_ID`
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
- `NEXT_PUBLIC_EMAILJS_CLUB_TEMPLATE_ID`

### 4. Deploy to Vercel

**Option 1: Deploy via Vercel Dashboard**

1. Login to your Vercel account
2. Import your GitHub repository
3. Configure the project settings:
   - Build Command: `pnpm run build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`
4. Click Deploy

**Option 2: Deploy via Vercel CLI**

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## Verification

After deployment, verify:

1. The home page loads correctly (https://necibnexus.com)
2. The contact form works
3. The club join form works
4. All pages and animations display correctly

## Troubleshooting

- If you see duplicate package warnings, check that package overrides are correctly set
- If API routes aren't working, confirm `output: 'export'` is removed from next.config.js
- If images aren't optimized, check the images configuration in next.config.js

## Additional Resources

- See DEPLOYMENT.md for more detailed information
- Run `node deploy.js` to check deployment readiness 