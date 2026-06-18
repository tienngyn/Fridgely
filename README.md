# Fridgely 🥦

**From Store to Fridge.** A clickable, mobile-first prototype for a smart grocery
shopping and food-management app for families and single-person households.

> This is a **visual prototype for presentation purposes only**. It uses fake data
> and has no backend, authentication, database, or real payments.

## ✨ Screens

1. **Onboarding / Welcome** — app icon, slogan, gradient background, decorative food shapes
2. **Home Dashboard** — greeting, Today's Shopping, Fridge Overview, Suggested Recipe
3. **Shopping List** — shared "Family List", checkable items with categories, Optimize Route, demo payment
4. **Store Map** — abstract supermarket map with aisles, product pins, optimized route
5. **Fridge Inventory** — item cards with status chips and an AI suggestion
6. **Recipes** — featured recipe with ingredient match, plus more suggestions
7. **Household** — family members, shared list, notification toggles

## 🎨 Design

Clean, iOS-inspired look — soft rounded cards, generous white space, subtle shadows,
glassmorphism navigation, and a fresh green→blue gradient palette.

| Token | Value |
| --- | --- |
| Primary green | `#34D399` |
| Primary blue | `#3B82F6` |
| Dark text | `#1F2937` |
| Secondary text | `#6B7280` |
| Background | `#F8FAFC` |
| Accent mint | `#D1FAE5` |
| Accent blue | `#DBEAFE` |

## 🚀 Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (default <http://localhost:5173>). Tap **Get Started**,
then explore the app via the bottom navigation. On a narrow screen the app fills the
viewport; on desktop it renders inside an iPhone frame.

```bash
npm run build     # production build
npm run preview   # preview the build
```

## 🧩 Tech & structure

- **React + Vite**, no external UI libraries — fast, zero-config startup.
- Reusable components in `src/components/`:
  `Card`, `PrimaryButton`, `StatusChip`, `ProductItem`, `BottomNav`, plus `Icon`, `Logo`, `StatusBar`.
- One screen per file in `src/screens/`.
- Styles split into `index.css` (frame + design tokens), `components.css`, `screens.css`.

```
src/
├── App.jsx              # phone shell + simple state-based routing
├── components/          # reusable UI building blocks
├── screens/             # the 7 app screens
└── styles/              # design tokens & component/screen CSS
```
