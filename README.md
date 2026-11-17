# valomedic-global
Valomedic Global Concierge Live Platform
# Valomedic Global Medical Concierge — Production V7 Deployment Guide

## Included Files
1. `index.html` — Complete production website with 30+ surgery departments, 8 global hubs (85 cities), live currency & translation tools, Razorpay Live Checkout (`rzp_live_Tz6etcmMyTOy9W`), PayPal International (`$29.99 USD`), PWA manifest/service-worker registration, and V7 CRM Bridge webhook integration.
2. `Code.gs` — Google Apps Script backend webhook for `Valomedic_CRM_&_Dynamic_Pricing_2026` (`Leads_Master` tab) with auto-incrementing `VALO-2026-XXX` Lead IDs and dual HTML email dispatch.
3. `manifest.json` & `sw.js` — Progressive Web App (PWA) configuration for one-tap mobile installation.

## 3-Step Activation
1. **Deploy `Code.gs` in Google Sheets**: Open `Valomedic_CRM_&_Dynamic_Pricing_2026` -> **Extensions > Apps Script**, paste `Code.gs`, and click **Deploy > New deployment > Web app** (Execute as: **Me**, Who has access: **Anyone**). Copy the generated `https://script.google.com/macros/s/.../exec` URL.
2. **Connect `index.html`**: Open `index.html`, locate `VALOMEDIC_PAYMENT_CONFIG`, and replace `YOUR_DEPLOYED_SCRIPT_ID` in `crmWebhookUrl` with your Web App URL.
3. **Upload to GitHub Repository**: Commit `index.html`, `manifest.json`, and `sw.js` to the root of your GitHub Pages repository.