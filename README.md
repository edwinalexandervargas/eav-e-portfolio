# Edwin Alexander Vargas · Frontend Developer Portfolio

Personal portfolio: featured projects, skills, background and contact.

🔗 [Live site](https://edwin-portfolio-theta.vercel.app/)

## Built with

- Semantic HTML
- Tailwind CSS v4 (CLI), with design tokens in `src/input.css`
- A small vanilla JS module (`Assets/js/main.js`): theme toggle, mobile menu, scroll reveal, contact form
- EmailJS for the contact form, loaded only when a message is sent
- Self-hosted Geist and Inter variable fonts; WebP/AVIF images

## Features

- Dark mode by default with a light toggle (saved in localStorage, follows the system setting)
- Responsive from 360px up; keyboard-accessible with a skip link and visible focus rings
- Respects `prefers-reduced-motion`
- Open Graph and Twitter share cards

## Develop

```bash
npm install
npm run dev     # watch src/input.css -> Assets/css/main.css
npm run build   # minified build
```

Serve the folder with any static server (for example `npx serve .`). Vercel runs `npm run build` on deploy; the compiled CSS is also committed, so the site works without a build step.
