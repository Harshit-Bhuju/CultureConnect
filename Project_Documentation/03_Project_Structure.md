# Project Structure

The project follows a standard React application structure inside the `src` directory.

## Root Directory (`src/`)

| Folder/File   | Description                                                                                     |
| :------------ | :---------------------------------------------------------------------------------------------- |
| `AdminPage/`  | Components and sub-pages specific to the Admin Dashboard.                                       |
| `assets/`     | Static assets like global images, SVGs, and fonts.                                              |
| `components/` | Reusable UI components and feature-specific blocks (Auth, ManageCourses, ManageProducts, etc.). |
| `Configs/`    | Configuration files (likely API endpoints or constants).                                        |
| `context/`    | React Context providers. Contains `AuthContext.jsx` for global user state.                      |
| `hooks/`      | Custom React hooks (e.g., `use-mobile.js` for responsive logic).                                |
| `pages/`      | Page-level components that correspond to Routes in `App.jsx`.                                   |
| `App.jsx`     | Main application entry point containing the Router and Route definitions.                       |
| `main.jsx`    | Bootstraps the React application and mounts it to the DOM.                                      |

## Key Subdirectories

### `src/components/`

Organized by feature domain:

- `Auth/`: Authentication related components (`LoginForm`, `ProtectedRoute` wrappers).
- `Common/`: Generic reusable components (`Loading`, `ScrollToTop`, `Buttons`).
- `Home/`: Sections used on the landing page (`HeroSection`, `BecomeSellerSection`).
- `ManageCourses/`: Complex components for Teacher course management (Upload, Edit, Analytics).
- `ManageProducts/`: Complex components for Seller product management.
- `Products/`: Product cards and display logic for the marketplace.
- `ui/`: Design system primitives (likely from shadcn/ui or custom Radix wrappers).

### `src/pages/`

Organized by route/page purpose:

- `Home/`: The landing page.
- `Login/`, `SignUp/`, `Otp/`: Authentication pages.
- `Marketplace/`: Main marketplace landing and category pages.
- `LearnCulture/`: Education hub pages.
- `Teacher/`: Teacher registration and profile pages.
- `BeSeller/`: Seller registration and profile pages.
- `Settings/`: User account settings.
- `Documentation/`: Public documentation pages (Terms, Privacy).
