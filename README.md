# Brainweave - A Smart Knowledge Base

**Live Demo:** [https://brainweave.vercel.app/](https://brainweave.vercel.app/)

---

## About The Project

Brainweave is a full-stack web application designed for knowledge workers, students, and developers to capture, organize, and retrieve their notes intelligently. I built this project to solve the common problem of scattered information by creating a single, searchable source of truth. It's built with a modern, scalable, and type-safe tech stack, forming the foundation for future smart features like spaced repetition and semantic search.

---

## Key Features

- **Rich Text Editor:** A modern, intuitive editor powered by Tiptap for creating detailed notes with full formatting capabilities.
- **Full Authentication Suite:** Secure user sign-up and login using email/password, as well as OAuth providers (Google & GitHub), powered by **Better Auth**. Includes robust email verification and password reset flows.
- **Advanced Note Management:** Full CRUD (Create, Read, Update, Delete) functionality for notes, managed through a clean and responsive UI.
- **Powerful Tagging System:** Organize notes with a flexible many-to-many tagging system, allowing for complex categorization and filtering.
- **Full-Text Search:** A robust search feature that instantly queries across note titles, content, and associated tags to find information quickly.
- **Secure & Efficient Backend:** The API is built with Next.js API Routes, protected by user session validation, and features efficient data retrieval with cursor-based pagination to handle large amounts of data.

---

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Better-Auth
- **UI:** Tailwind CSS, ShadCN UI
- **Schema Validation:** Zod
- **Editor:** Tiptap
- **Deployment:** Vercel

---

## Running Locally

To get a local copy up and running, follow these simple steps.

***Note: This project uses `pnpm` as the package manager.***

### Prerequisites

- Node.js (v18 or later)
- pnpm
- A PostgreSQL database

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/vikram-ramji/brainweave.git](https://github.com/vikram-ramji/brainweave.git)
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd brainweave
    ```
3.  **Install dependencies using pnpm:**
    ```sh
    pnpm install
    ```
4.  **Set up your environment variables:**
    - Create a `.env` file in the root of the project.
    - Copy the contents of `.env.example` into your new `.env` file.
    - Fill in the required values (Database URL, Google/GitHub credentials, Resend API key, etc.).
5.  **Run database migrations:**
    ```sh
    pnpm prisma migrate dev
    ```
6.  **Start the development server:**
    ```sh
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.