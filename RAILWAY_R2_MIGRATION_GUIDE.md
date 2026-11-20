# NOET-2027: Railway + Cloudflare R2 Production Deployment Guide

This guide describes how to complete the production deployment of the NOET-2027 conference website using **Railway** (for Django API and PostgreSQL) and **Cloudflare R2** (for PDF abstract uploads), while keeping the **existing Vercel frontend URL (`https://noet-2027-website.vercel.app`) completely unchanged**.

---

## 1. Cost & Plan Summary

| Service | Plan | Monthly Cost (USD) | Monthly Cost (INR) | Total until Conference (Feb 2027) | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Vercel** | Hobby | $0.00 | ₹0 | ₹0 | Frontend CDN, keeps existing public URL. |
| **Railway** | Hobby | $5.00 | ₹425 – ₹490 | ~₹1,470 (3 months) | Includes $5 free usage credit. Covers both Django API & PostgreSQL. Never pauses. |
| **Cloudflare R2** | Free Tier | $0.00 | ₹0 | ₹0 | Up to 10 GB free forever. Zero egress fees. Never pauses. |
| **TOTAL** | | **~$5.00 / mo** | **~₹490 / month** | **~₹1,470 total** | **Fits well within your ₹500–₹1,000/month budget.** |

---

## 2. Step 1: Cloudflare R2 Setup (Takes ~3 minutes)

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com/) and sign in (or sign up for free).
2. In the left sidebar, click **R2 Object Storage**.
3. Click **Create bucket**:
   - Bucket name: `noet-2027-abstracts`
   - Location: `Automatic` (or choose Asia Pacific)
   - Click **Create Bucket**.
4. In the right panel of R2 Overview, click **Manage R2 API Tokens**.
5. Click **Create API Token**:
   - Token name: `noet-2027-backend-token`
   - Permissions: `Admin Read & Write` (or `Object Read & Write`)
   - Specify bucket: Apply to `noet-2027-abstracts` (or All buckets)
   - TTL: Leave forever
   - Click **Create API Token**.
6. Copy and save these 3 values (do not share them publicly):
   - **Access Key ID**
   - **Secret Access Key**
   - **Endpoint URL** (looks like: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`)

---

## 3. Step 2: Railway Backend & Database Setup (Takes ~5 minutes)

1. Go to [railway.com](https://railway.com/) and sign in with your GitHub account (`nageshwar2027`).
2. Upgrade to the **Hobby Plan** ($5/month) in Account Settings > Plans.
3. Click **New Project** > **Provision PostgreSQL**.
   - Railway will instantly provision a dedicated PostgreSQL database that never pauses.
4. In the same project canvas, click **+ Create** (or **New Service**) > **GitHub Repo**.
   - Select your repository: `nageshwar2027/noet-2027-website`.
5. Click on the newly created web service and go to **Settings**:
   - **Root Directory:** Set to `backend`
   - **Build Command:** (Railway will automatically detect Python and use `railway.json`)
6. Go to the **Variables** tab of the web service and click **New Variable**:
   Add the following environment variables:
   - `DJANGO_SECRET_KEY`: *(Enter any long random string of letters and numbers)*
   - `DJANGO_DEBUG`: `false`
   - `DJANGO_ALLOWED_HOSTS`: `127.0.0.1,localhost` *(Django automatically detects and permits your Railway domain without wildcards)*
   - `DATABASE_URL`: Click **Add Reference** and select `${{Postgres.DATABASE_URL}}`

   - `CORS_ALLOWED_ORIGINS`: `https://noet-2027-website.vercel.app`
   - `CSRF_TRUSTED_ORIGINS`: `https://noet-2027-website.vercel.app`
   - `R2_ACCESS_KEY_ID`: *(Your Cloudflare R2 Access Key ID)*
   - `R2_SECRET_ACCESS_KEY`: *(Your Cloudflare R2 Secret Access Key)*
   - `R2_BUCKET`: `noet-2027-abstracts`
   - `R2_ENDPOINT_URL`: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
   - `R2_REGION`: `auto`
   - `DJANGO_ADMIN_USERNAME`: `admin` *(or your preferred username)*
   - `DJANGO_ADMIN_PASSWORD`: *(A strong password for your Django Admin)*
   - `DJANGO_ADMIN_EMAIL`: `24dr0104@iitism.ac.in`
7. Go to **Settings** > **Networking** > Click **Generate Domain**.
   - Railway will assign a public domain like: `https://noet-2027-website-production.up.railway.app`
8. Wait for the deploy to complete (about 60–90 seconds).
   - Test it by visiting: `https://YOUR-RAILWAY-DOMAIN.up.railway.app/health/?db=1`
   - It should return: `{"status": "ok", "database": "ok"}` within 0.2 seconds!

---

## 4. Step 3: Connect Existing Vercel Frontend (Takes ~1 minute)

**Your public URL `https://noet-2027-website.vercel.app` remains 100% unchanged.**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard) and click on your project **`noet-2027-website`**.
2. Go to **Settings** > **Environment Variables**.
3. Locate `VITE_API_URL` (or add it if not already present):
   - Value: `https://YOUR-RAILWAY-DOMAIN.up.railway.app` (replace with your actual Railway domain from Step 2)
   - Environments: Check **Production**, **Preview**, and **Development**.
   - Click **Save**.
4. Go to the **Deployments** tab > Click the three dots (`...`) next to the latest deployment > Click **Redeploy**.
5. Once redeployed, visit `https://noet-2027-website.vercel.app`.

---

## 5. Step 4: Verification Checklist

1. Open `https://noet-2027-website.vercel.app`.
2. Scroll to the **Registration** section:
   - Fill in test registration details.
   - Click **Submit Registration**.
   - You should see `Registration successful!` within **1 to 2 seconds** (no 60-second timeouts!).
3. Click the **Submit Abstract** button:
   - Fill in name, email, institution.
   - Attach a sample PDF.
   - Click **Submit Abstract**.
   - You should see `Abstract submitted successfully!` in 1 to 2 seconds.
4. Log into Django Admin at `https://YOUR-RAILWAY-DOMAIN.up.railway.app/admin/`:
   - Check **Registrations**: Verify your test submission is present.
   - Check **Abstract Submissions**: Verify the submission record exists and clicking the document link downloads the uploaded PDF via Cloudflare R2!
5. Delete the test registration and abstract record from Django Admin so your conference database is clean for real attendees.

---

## 6. Backup & Rollback Plan

### Automated Backups
- **PostgreSQL Database:** In Railway, automated daily snapshots of your database are captured. You can also export a full database dump anytime from the Railway Postgres dashboard or via command line:
  ```bash
  pg_dump -d "<YOUR_DATABASE_URL>" > noet_backup.sql
  ```
- **Cloudflare R2 Files:** R2 replicates files across Cloudflare's distributed storage with 99.999999999% (11 9's) durability.

### Rollback (Zero Risk)
If you ever need to revert to the old backend:
1. In Vercel > Settings > Environment Variables, change `VITE_API_URL` back to `https://noet-2027-website.onrender.com`.
2. Click **Redeploy** on Vercel.
3. The site instantly connects back to the old Render backend.
