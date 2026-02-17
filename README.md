# Niraa — Premium Futuristic E-commerce Front-End

A production-style, static front-end for **Niraa – A unit of SP Impex**, designed with an ultra-clean, Apple-inspired visual language.

## Folder Structure

```text
Niraa/
├── index.html                # Main storefront + hero slider + product showcase + cart/checkout UI
├── css/
│   └── styles.css            # Premium theme, animations, responsive layout, glassmorphism UI
├── js/
│   └── app.js                # Sliders, scroll effects, filtering, cart, modal, checkout demo logic
├── pages/
│   ├── account.html          # Login / Register (UI only)
│   └── bulk-order.html       # SP Impex bulk inquiry page (UI only)
└── assets/                   # Reserved for local brand assets/images
```

## Features

- Full-screen hero with auto sliding background images + dot controls
- Animated navbar that changes on scroll
- Featured collection image carousel
- Product filtering and interactive showcase cards
- Floating animated cart icon + slide-out cart drawer
- Product details modal and checkout modal flow
- Smooth scrolling and reveal-on-scroll animation
- Responsive login/register and premium-styled bulk order page

## Run locally

```bash
python3 -m http.server 8000
```

Open: `http://localhost:8000`
