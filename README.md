# TaskManager — Next.js + Supabase Task Manager App

> A modern, minimal, and responsive **Task Manager Web App** built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **Supabase**, and **Zustand**.  
> Designed for clarity, performance, and simplicity.

---

## Overview

**TaskManager** lets users securely **sign up, log in, and manage personal tasks** with a clean UI and smooth experience.  
Each user’s tasks are private and synced in real-time with **Supabase**.  
This project demonstrates a complete **full-stack Next.js** setup with authentication, database integration, and state management.

---

## Features

Email + Password Authentication (Supabase Auth)  
 Create, View, Edit and Delete Tasks  
 User-Specific Data Isolation  
 Real-Time Database Sync with Supabase  
 State Management with Zustand  
 Accessible UI Components (shadcn/ui)  
 Responsive Design using Tailwind CSS  
 100% TypeScript — Safe, Scalable, and Clean

---

## Tech Stack

| Technology                       | Purpose                            |
| -------------------------------- | ---------------------------------- |
| **Next.js 15.5.4+ (App Router)** | Full-stack React framework         |
| **TypeScript**                   | Static type checking               |
| **Tailwind CSS**                 | Utility-first styling              |
| **shadcn/ui**                    | Accessible, reusable UI components |
| **Supabase**                     | Auth & database (PostgreSQL)       |
| **Zustand**                      | Global state management            |
| **Prisma ORM**                   | Schema management and migrations   |

---

## Setup & Installation

### 1️ Clone the Repository

```bash
git clone https://github.com/yourusername/taskmanager.git
cd taskmanager
```

### 2 Install Dependencies

```bash
npm install
# or
yarn install
```

### 3 Create a .env.local file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Project Structure

prisma
└── schema.prisma
src
 ├──app/
 │  ├── (auth)/
 │  │ └── page
 │  ├── (tasks)/
 │  │ └── page
 │  ├── global.css
 │  ├── layout.tsx
 │  └── page.tsx
 ├──components/
 │  ├── layout/
 │  ├── ui/
 │  ├── AddTaskDialogue.tsx
 │  ├── EmptyState.tsx
 │  ├── Navbar.tsx
 │  ├── SearchBar.tsx
 │  ├── TaskCard.tsx
 │  └── TaskSkeleton.tsx
 ├──integration/
 │  └── supabase
 │  ├── client.ts
 │  └──type.ts
 ├──lib/
 │  ├── supabase.ts
 │  ├── zustand/
 │  ├── utils.ts
 │  └── globals.css
 └──store/
    └── taskStore.ts
