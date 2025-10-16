# Future Readiness App (Next.js + Tailwind)

A minimal Next.js (App Router) project with Tailwind preconfigured and an example `Assessment` component.
Deploy-ready for Vercel.

## Quick Start

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Deploy to Vercel
1. Push this folder to a GitHub repository.
2. In Vercel, **New Project → Import Git Repository**.
3. Use defaults (Build Command: `next build`, Output: `.next`).
4. Deploy.

## Where the styles are

- Global Tailwind directives: `app/globals.css`
- Imported in: `app/layout.tsx`
- Tailwind is configured in `tailwind.config.js` with globs that include `app/` and `components/`

## Customization

- Put static assets in `/public`
- Add new pages in `app/your-page/page.tsx`
- Reuse the `Assessment` component or build your own
