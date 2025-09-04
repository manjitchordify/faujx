## Project Tree:

```plaintext
faujx/
├── eslint.config.mjs           # ESLint configuration for code quality
├── next.config.ts              # Next.js project config
├── package.json                # Project dependencies and scripts
├── package-lock.json           # Exact dependency versions (npm)
├── postcss.config.mjs          # Tailwind/PostCSS config
├── public/                     # Static files served as-is
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── README.md                   # Project documentation or usage info
├── tsconfig.json               # TypeScript compiler options
└── src/                        # Main source directory
    └── app/                    # App Router directory (Next.js 13+)
        ├── components/         # Reusable UI components
        │   ├── Button.tsx
        │   ├── Footer.tsx
        │   ├── Header.tsx
        │   ├── Loading.jsx
        │   ├── MatchedTalentCard.tsx
        │   ├── PricePlanCard.tsx
        │   ├── UserStoryCard.tsx
        │   └── VerticalSlider.tsx
        ├── favicon.ico         # Site icon
        ├── globals.css         # Global styles (e.g., Tailwind imports)
        ├── hooks/              # Custom React hooks (empty currently)
        ├── layout.tsx          # Root layout for all routes
        ├── lib/                # Utilities and helper functions (empty currently)
        ├── pages/              # App Router pages (each folder is a route)
        │   ├── about/
        │   │   └── page.tsx    # /about
        │   ├── blog/
        │   │   └── page.tsx    # /blog
        │   ├── book-a-mentor/
        │   │   └── page.tsx    # /book-a-mentor
        │   ├── customer/
        │   │   └── page.tsx    # /customer
        │   ├── engineers/
        │   │   └── page.tsx    # /engineers
        │   ├── experts/
        │   │   └── page.tsx    # /experts
        │   ├── frequently-asked-questions/
        │   │   └── page.tsx    # /frequently-asked-questions
        │   ├── home/
        │   │   └── page.tsx    # /home
        │   ├── pricing/
        │   │   └── page.tsx    # /pricing
        │   ├── success-stories/
        │   │   └── page.tsx    # /success-stories
        │   └── testimonials/
        │       └── page.tsx    # /testimonials
        ├── page.tsx            # Home route (/)
        ├── styles/             # CSS modules or Tailwind entrypoint
        │   └── tailwind.css
        └── types/              # TypeScript interfaces/types (empty currently)




## 📁 Notable Directories
components/
Reusable and composable UI elements like buttons, cards, sliders, etc.

pages/
Each folder under pages/ is a route (e.g. success-stories/page.tsx → /success-stories).

hooks/
Custom React hooks for logic reuse, e.g., useUser.ts, useAuth.ts.

lib/
Utility functions for formatting, API fetching, etc.

types/
TypeScript type definitions to enforce data contracts.

styles/
CSS files like tailwind.css and global overrides.

public/
All static files like images and icons — accessible via /filename.
```
