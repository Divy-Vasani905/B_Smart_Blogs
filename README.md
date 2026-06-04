# BlogHub - Next.js Blog Website

A vibrant, colorful blog website built with **Next.js 14**, React, TypeScript, and Tailwind CSS.

## 🎨 Features

- **Home Page**: Hero section with animated blobs, latest posts, and popular posts
- **Blog List Page**: Browse all blogs with tabs (All/Latest/Popular) and search functionality
- **Individual Blog Posts**: Detailed blog post view with hero image, content, and related posts
- **About Page**: Information about BlogHub with feature cards
- **Search Functionality**: Search across all blog posts by title, excerpt, category, or author
- **Responsive Design**: Seamless experience on mobile, tablet, and desktop
- **Colorful Design**: Vibrant gradients using violet, blue, cyan, orange, yellow, and green (no pink!)

## 📁 Project Structure

```
/app
  ├── layout.tsx          # Root layout with Header and global styles
  ├── page.tsx            # Home page (/)
  ├── blogs/
  │   └── page.tsx        # Blog list page (/blogs)
  ├── blog/
  │   └── [id]/
  │       └── page.tsx    # Dynamic blog post (/blog/[id])
  └── about/
      └── page.tsx        # About page (/about)

/components
  ├── Header.tsx          # Navigation header with search
  ├── HomePage.tsx        # Home page content
  ├── BlogListPage.tsx    # Blog list with tabs and search
  ├── BlogPostPage.tsx    # Individual blog post
  ├── BlogCard.tsx        # Reusable blog card component
  ├── AboutPage.tsx       # About page content
  ├── figma/
  │   └── ImageWithFallback.tsx  # Protected image component
  └── ui/                 # Shadcn UI components

/lib
  └── blog-data.ts        # Blog post data and utility functions

/styles
  └── globals.css         # Global styles, Tailwind config, and animations
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **Images**: Unsplash API

## 🌐 Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with hero, latest posts, and popular posts |
| `/blogs` | All blog posts with tabs and search |
| `/blogs?search=query` | Search results page |
| `/blog/[id]` | Individual blog post with dynamic ID |
| `/about` | About page with mission and values |

## 🎯 Key Next.js Features Used

- **App Router**: Modern file-based routing with the `/app` directory
- **Server Components**: Default server-side rendering for optimal performance
- **Client Components**: Interactive components marked with `"use client"`
- **Dynamic Routes**: Blog posts use `[id]` dynamic segments
- **Search Params**: URL parameters for search functionality
- **Link Component**: Client-side navigation with `next/link`
- **Metadata API**: SEO-friendly meta tags in `layout.tsx`
- **Image Optimization**: Configured for Unsplash domains

## 🎨 Design Features

- **Gradient Backgrounds**: Colorful gradients throughout the site
- **Animated Blobs**: Floating blob animations on hero section
- **Hover Effects**: Smooth transitions on cards and buttons
- **Color-Coded Categories**: Each blog category has unique gradient badges
- **Responsive Typography**: Adapts to different screen sizes
- **Custom Animations**: Blob animation defined in `globals.css`

## 📝 Blog Data

The blog includes 8 sample posts covering:
- Web Development
- Design
- React
- CSS
- TypeScript
- AI & Technology
- Performance
- Accessibility

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔄 Migration from React Router

This project was converted from React Router to Next.js App Router:

| React Router | Next.js |
|--------------|---------|
| `BrowserRouter` | App Router with `/app` directory |
| `react-router-dom` Link | `next/link` |
| `useNavigate()` | `useRouter()` from `next/navigation` |
| `useParams()` | `params` prop in page components |
| `useSearchParams()` | `searchParams` prop in page components |
| Client-side only | Server + Client components |

## 🎨 Color Palette

- **Violet**: Primary brand color
- **Blue**: Secondary accent
- **Cyan**: Tertiary accent
- **Orange**: Latest posts section
- **Yellow**: Warm accent for latest posts
- **Green**: Popular posts section
- **Teal**: Cool accent for popular posts

## 📄 License

This is a demo project for showcasing Next.js capabilities.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
