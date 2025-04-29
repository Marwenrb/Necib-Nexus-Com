# Necib Nexus Deployment Guide

This guide explains how to deploy the Necib Nexus website to Vercel.

## Prerequisites

- Node.js 18 or later
- PNPM 8.x
- Vercel CLI (optional for command-line deployment)

## Deployment Configuration

### Step 1: Environment Variables

Make sure to set these environment variables in your Vercel project settings:

- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`: The EmailJS service ID (default: service_4mvgv76)
- `NEXT_PUBLIC_EMAILJS_USER_ID`: Your EmailJS user ID
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`: The EmailJS template ID for contact forms
- `NEXT_PUBLIC_EMAILJS_CLUB_TEMPLATE_ID`: The EmailJS template ID for club join forms

### Step 2: Dependency Management

The project uses package overrides to manage duplicate dependencies. Make sure your `package.json` has these overrides in the pnpm section:

```json
"pnpm": {
  "overrides": {
    "react": "$react",
    "react-dom": "$react-dom",
    "scheduler": "0.23.2",
    "zustand": "4.5.6"
  }
}
```

### Step 3: Next.js Configuration

The `next.config.js` file should NOT contain `output: 'export'` to enable all Next.js features including API routes.

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard

1. Login to your Vercel account
2. Import your GitHub repository
3. Configure the project:
   - Build Command: `pnpm run build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`
4. Add the environment variables
5. Deploy

### Option 2: Deploy via CLI

1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Run the deployment checker: `node deploy.js`
4. Deploy to production: `vercel --prod`

## Troubleshooting

### Duplicate Package Warnings

If you see warnings about duplicate packages, make sure the overrides are properly set in package.json.

### API Routes Not Working

Make sure you've removed `output: 'export'` from next.config.js.

### Environment Variable Issues

Double-check that all environment variables are set correctly in the Vercel dashboard.

## Maintenance

After deployment, run the following to verify everything is working:

1. Test the contact form submission
2. Test the NEXUS Club join form
3. Verify all pages load correctly and animations are working

## Support

For deployment issues, contact the development team or refer to the [Vercel documentation](https://vercel.com/docs). 