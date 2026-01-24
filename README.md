# CultureConnect 🌏

**CultureConnect** is a community-driven platform designed to bridge cultures through art, tradition, and creativity. It acts as a dual-purpose digital ecosystem: a **Marketplace** for authentic cultural artifacts and a **Learning Hub** for preserving traditional skills.

---

## 📚 Table of Contents

- [Features](#-features)
- [Modules](#-modules)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Documentation](#-project-documentation)
- [Contributors](#-contributors)

---

## ✨ Features

### 🛍️ Marketplace (E-commerce)

A dedicated platform for artisans to sell physical cultural goods.

- **Categories**: Traditional Clothing, Musical Instruments, Arts & Decors.
- **Seller Dashboard**: Manage products, view sales analytics, and customize seller profiles.
- **Shopping Experience**: Add to cart, secure checkout flow, and order tracking.

### 💃 Learn Culture (EdTech)

An educational platform connecting cultural experts with eager learners.

- **Categories**: Dance, Singing, Instruments, Art & Crafts.
- **Teacher Dashboard**: Create courses, manage enrollments, and track student progress.
- **Learning Experience**: Video courses (implied), class bookings, and teacher reviews.

### 🔐 Authentication & Security

- **Secure Access**: Role-based routing ensures only verified Sellers and Teachers can access management dashboards.
- **User Accounts**: Login via Email or Google, with OTP-based password recovery.

---

## 🛠 Tech Stack

This project is built with a modern, performance-focused React ecosystem.

| Category             | Technologies                                                  |
| :------------------- | :------------------------------------------------------------ |
| **Frontend**         | React 19, Vite 7, React Router 7                              |
| **Styling**          | Tailwind CSS 4, Radix UI (Primitives), Lucide React (Icons)   |
| **Animation**        | GSAP, Framer Motion, Rive React Canvas, Lenis (Smooth Scroll) |
| **State Management** | React Context API                                             |
| **Utilities**        | React Hot Toast, Chart.js, Embla Carousel                     |

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/Harman-Bhuju/CultureConnect
    cd cultureconnect
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server**

    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Visit `http://localhost:5173` (or the port shown in your terminal).

---

## 📂 Project Documentation

We have detailed documentation available in the `Project_Documentation/` folder:

- **[01_Project_Overview.md](./Project_Documentation/01_Project_Overview.md)**: High-level vision and user roles.
- **[02_Technical_Stack.md](./Project_Documentation/02_Technical_Stack.md)**: In-depth list of libraries and tools.
- **[03_Project_Structure.md](./Project_Documentation/03_Project_Structure.md)**: Guide to the folder structure.
- **[04_Authentication_Routing.md](./Project_Documentation/04_Authentication_Routing.md)**: Explanation of protected routes and security.
- **[05_Modules_Overview.md](./Project_Documentation/05_Modules_Overview.md)**: Marketplace vs. Learn Culture breakdown.
- **[06_Detailed_Pages_Guide.md](./Project_Documentation/06_Detailed_Pages_Guide.md)**: Description of every file in `src/pages`.
- **[07_Detailed_Components_Guide.md](./Project_Documentation/07_Detailed_Components_Guide.md)**: Guide to key components in `src/components`.

---

## 🤝 Contributors

- **Harshit Bhuju** – Frontend Development, Auth, UI/UX
- **Harman Bhuju** – Backend, Database, API Integration

---

_Built with ❤️ for culture._
