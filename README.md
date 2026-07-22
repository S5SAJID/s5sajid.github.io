# Mono Portfolio

A modern, minimalist portfolio and blog built with Astro, featuring a beautiful monochromatic design aesthetic.

<!-- ![Portfolio Preview](public/preview.png) -->

## Features

- Minimalist Monochromatic Design
- Fully Responsive Layout
- Custom Cursor Effects
- Integrated Blog Platform
- SEO Optimized
- JSON-LD Schema Support
- GSAP Animations
- Sitemap Generation
- Mobile-First Approach
- Lightning Fast Performance

## Tech Stack

- [Astro](https://astro.build) - Static Site Generator
- [TailwindCSS](https://tailwindcss.com) - Styling
- [GSAP](https://greensock.com/gsap) - Animations
- TypeScript - Type Safety
- Content Collections - Blog Management

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Bun package manager

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/mono-portfolio.git
cd mono-portfolio
```

2. Install dependencies

```bash
bun install
```

3. Start the development server

```bash
bun dev
```

Visit `http://localhost:4321` to see your site!

## Project Structure

```
/
├── public/            # Static assets
├── src/
│   ├── assets/       # Project assets
│   ├── components/   # UI components
│   ├── content/      # Blog posts and collections
│   ├── layouts/      # Page layouts
│   ├── pages/        # Route pages
│   ├── styles/       # Global styles
│   ├── types/        # TypeScript types
│   └── utils/        # Utility functions
└── package.json
```

## Configuration

### Blog Posts

Add your blog posts in `src/content/blog/` using MDX format:

```md
---
title: Your Post Title
description: Brief description
excerpt: Post excerpt
category: Category
date: 2024-04-07
lastModified: 2024-04-07
readTime: 5 min read
tags: [tag1, tag2]
image: /path/to/image.jpg
imageAlt: Image description
---

Your content here...
```

## Commands

| Command         | Action                   |
| --------------- | ------------------------ |
| `bun dev`       | Start development server |
| `bun build`     | Build production site    |
| `bun preview`   | Preview production build |
| `bun astro ...` | Run Astro commands       |

## Performance

- Lighthouse Score: 100/100
- Core Web Vitals Optimized
- Zero JavaScript by Default
- Optimal Asset Loading

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Star this repo if you found it helpful!
