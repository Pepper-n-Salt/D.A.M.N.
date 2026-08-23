# D.A.M.N.

Digital-Artwork-Management-Network

# Exhibition CMS

A modern content management system for museums and exhibitions.

## Features

- Authentication
- Role management
- Exhibition editor
- QR Codes
- Interactive quizzes
- Responsive Design

## Tech Stack

React
Express
PostgreSQL
Tailwind CSS

## Screenshots

...

## Live Demo

...

## Installation

...

___ ab hier neu ___

# D.A.M.N.
## Digital Artwork Management Network

**D.A.M.N.** is a full-stack web application for the **digital management, organisation and presentation of exhibitions and artworks**.

The platform was developed for museums, galleries and cultural institutions that want to manage their exhibitions digitally while creating a modern and interactive experience for visitors.

D.A.M.N. brings together **exhibition management, artwork and artist management, multimedia content and visitor interaction** in one central platform. Physical exhibitions can be connected to digital content, while interactive quizzes and multilingual content provide additional ways for visitors to engage with an exhibition.

The system combines a modern web-based CMS with a visitor-facing experience and integrates services such as **Cloudinary** and **Mistral AI** to extend its capabilities.

---
  
## Features

### Current Features

* **Exhibition Management**
  Create and manage exhibitions and their associated content.

* **Artwork & Artist Management**
  Organise artworks, artists and their relationships within exhibitions.

* **Authentication & Roles**
  Secure authentication with JWT and role-based access management.

* **Interactive Quizzes**
  Create interactive experiences that encourage visitors to actively engage with exhibitions.

* **Multilingual Content**
  Support for multiple languages across exhibitions, artworks and artists.

* **Media Management**
  Upload and manage exhibition media using Cloudinary.

* **AI Integration**
  Integration of Mistral AI for AI-powered translations.

### Coming Up Next

* **QR Code Integration**
  Connect physical artworks and exhibition spaces with their corresponding digital content.

* **Dynamic Exhibition Theming**
  New screens that automatically adopt an exhibition's visual identity, including background colours, font colours, typography and other design elements.

* **Further Features & UX Improvements**
  Continued development of new functionality and refinement of the overall user experience.

* **Responsive Design**
  Designed for desktop, tablet and mobile devices.


---

## Screenshots

### Dashboard

<!-- screenshot -->

### Exhibition Management

<!-- screenshot -->

### Exhibition Editor

<!-- screenshot -->

### Artwork Management

<!-- screenshot -->

### Visitor Experience

<!-- screenshot -->

---

## Tech Stack

**Frontend**

React · Vite · TypeScript · React Router · Tailwind CSS · i18next · Bun

**Backend**

Bun · Express · TypeScript · Sequelize · PostgreSQL · JWT · bcrypt · Zod · WebSockets

**Services**

Cloudinary · Mistral AI · Nodemailer · Multer

---

## Architecture

```text
                    D.A.M.N.
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
     ┌───────────┐             ┌───────────┐
     │ Frontend  │    API      │  Backend  │
     │           │◄───────────►│           │
     │ React     │             │ Express   │
     │ Vite      │             │ Bun       │
     │ TypeScript│             │ Sequelize │
     └───────────┘             └─────┬─────┘
                                     │
                      ┌──────────────┼──────────────┐
                      ▼              ▼              ▼
                 PostgreSQL     Cloudinary     Mistral AI
```

---

## Getting Started

### Prerequisites

* [Bun](https://bun.sh/)
* [PostgreSQL](https://www.postgresql.org/)
* Git

### Clone the repository

```bash
git clone https://github.com/Pepper-n-Salt/D.A.M.N..git
cd D.A.M.N.
```

### Backend

```bash
cd backend
bun install
```

Create an `.env` file (s. .env.sample)
```

Set up the development database:

```bash
bun run db:setup
```

Start the backend:

```bash
bun run dev
```

### Frontend

Open a second terminal:

```bash
cd frontend
bun install
```

Create another `.env` file (s. .env.sample).
```

Start the frontend:

```bash
bun run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## Project Structure

```text
D.A.M.N.
├── frontend/
├── backend/
└── README.md
```

The **frontend** contains the CMS and visitor-facing interface.

The **backend** provides the API, authentication, business logic, database access and external service integrations.

---

## Internationalisation

D.A.M.N. supports multilingual exhibition content using **i18next** and **React i18next**.

Exhibitions, artworks and artists can have dedicated translated content, allowing the same exhibition to be presented in multiple languages.

---

## Project Status

**MVP Completed · UX Improvements & Further Features in Progress**

The **Minimum Viable Product (MVP)** of D.A.M.N. has been completed and the core functionality is fully implemented.

Current development focuses on:

* **UX & UI improvements** — Refining the user experience and visual design.
* **Dynamic exhibition theming** — New screens are being developed to automatically adopt an exhibition's visual identity, including its background colours, typography, font colours and other design elements.
* **Performance & usability** — Improving the overall experience across different devices.
* **New features** — Expanding the platform with additional functionality.
* **Bug fixes & refinement** — Continuously improving stability and quality.

The project is therefore **actively maintained and continuously evolving beyond the initial MVP**.


---

## Contributors

Developed by **Pepper-n-Salt**.

---

## License

No open-source license has currently been specified for this repository.

---

## Repository

[GitHub — D.A.M.N.](https://github.com/Pepper-n-Salt/D.A.M.N.)
