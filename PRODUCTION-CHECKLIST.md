# Production Readiness Checklist

What's left before this app can go live.

---

## Must Fix (Deal Breakers)

### Payments are fake
The donate page just logs to console. No money actually moves. You need to integrate a real payment gateway — **Razorpay** makes the most sense since prices are in INR. The UPI QR code is a grey placeholder box and the bank details are made up.

### MongoDB won't work in the browser
The `mongodb` npm package is a server-side library. It cannot run in a browser. You either need:
- A backend API (Express, Fastify, or serverless functions) that the frontend calls, OR
- Drop MongoDB entirely and use Supabase for everything (it already handles most of the data)

### No backend server exists
Right now everything talks directly to Supabase from the browser. That's fine for reads, but for sensitive operations (payments, admin actions, email sending), you need server-side logic. Consider Supabase Edge Functions or a small Node.js API.

### Mapbox token is missing
Priest tracking uses `mapbox-gl` but there's no access token configured anywhere. The map will just fail silently. Get a token from mapbox.com and wire it in.

### Remove the Lovable tracking script
`index.html` includes `cdn.gpteng.co/gptengineer.js` — this is Lovable's development script. Remove it before deploying.

---

## Should Fix (Security & Stability)

### Environment variables
Supabase credentials are hardcoded. Move them to a `.env` file using Vite's `VITE_` prefix convention. Create a `.env.example` so other developers know what's needed. Same for the Mapbox token and any future API keys.

### Audit Supabase RLS policies
The anon key is exposed in the client (that's normal), but it means Row Level Security is your only protection. Verify that:
- Users can only read/edit their own bookings and profile
- Only admins can access admin endpoints
- Priest profiles can only be edited by the priest who owns them

### Add error boundaries
If any component crashes, the whole app goes white. Wrap the app in a React error boundary so users see a friendly error page instead of nothing.

### No email service
The contact form saves to the database but nobody gets notified. Hook up something like Resend, SendGrid, or Supabase Edge Functions to actually send emails.

---

## Should Fix (Deployment)

### SPA routing config
Since this is a single-page app, refreshing on `/priests` or `/track-booking/123` will return a 404 on most hosts. You need:
- **Netlify**: add a `public/_redirects` file with `/* /index.html 200`
- **Vercel**: add a `vercel.json` with rewrites
- **Nginx**: configure `try_files`

### Install dependencies and test the build
`node_modules` doesn't exist yet. Run `npm install && npm run build` and fix any build errors before deploying.

### Update OG image and metadata
The OpenGraph image in `index.html` points to `lovable.dev`. Replace it with your own image hosted on your domain.

---

## Nice to Have (Quality of Life)

### Add basic tests
There are zero tests. At minimum, add tests for auth flow, booking creation, and payment submission to catch regressions.

### Loading and empty states
Some pages will show blank content if Supabase is slow or down. Add loading spinners and "no data" messages where needed.

### Image optimization
Decorative images are loaded from Pixabay CDN. Host them locally or on your own CDN, and add lazy loading for better performance.

### CI/CD pipeline
Set up GitHub Actions (or similar) to run `npm run build` and `npm run lint` on every push. Catches issues before they reach production.

### Monitoring
Add basic error tracking (Sentry or similar) so you know when things break in production rather than finding out from users.

---

## Quick Priority Order

1. Remove Lovable script from `index.html`
2. Set up `.env` files and move credentials
3. Decide: backend API or drop MongoDB for Supabase-only
4. Integrate Razorpay for payments
5. Add Mapbox token
6. Audit RLS policies
7. Add SPA routing config for your host
8. Test the build, deploy, and iterate on the rest
