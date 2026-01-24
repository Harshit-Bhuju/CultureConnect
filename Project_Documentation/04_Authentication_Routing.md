# Authentication & Routing

CultureConnect uses `react-router-dom` for navigation and a custom Context for authentication state management.

## Auth Context

Located in `src/context/AuthContext.jsx`, this provider manages:

- **Current User State**: Stores the logged-in user object (including `role`, `id`, `seller_id`, `teacher_id`).
- **Loading State**: Prevents route rendering until auth status is determined.
- **Login/Logout Methods**: Handles API interaction for session management.

## Protected Routes

To ensure security and role-based access, the application uses several "Route Wrapper" components. These wrap the actual page components in `App.jsx`.

### 1. `ProtectedRoute.jsx`

- **Usage**: General pages for logged-in users (e.g., Cart, Checkout, Settings).
- **Logic**: Checks if `user` exists. Use `Navigate` to redirect to `/login` if not.

### 2. `PublicRoute.jsx`

- **Usage**: Guest-only pages (Login, Signup, Forgot Password).
- **Logic**: If user is already logged in, redirects them to Home or Dashboard. Preventing authenticated users from seeing login screens.

### 3. `ProtectedSellerRoute.jsx`

- **Usage**: Seller Dashboard, Product Upload, Seller Profile Editing.
- **Logic**:
  1.  Checks if user is logged in.
  2.  Checks if user has a `seller_id`.
  3.  **Strict ID Check**: If the route URL contains a `:sellerId` parameter, it verifies that this ID matches the logged-in user's `seller_id`. This prevents Seller A from accessing Seller B's management pages.

### 4. `ProtectedTeacherRoute.jsx`

- **Usage**: Teacher Dashboard, Course Upload, Class Management.
- **Logic**: Similar to Seller Route, ensuring the user is a verified teacher and prohibiting cross-account access via URL manipulation.

### 5. `AdminProtectedRoute.jsx`

- **Usage**: Admin Panel.
- **Logic**: Checks if `user.role === 'admin'`.

## Route structure in `App.jsx`

Routes are grouped logically:

- **Global**: `/`, `/login`, `/signup`
- **Marketplace**: `/marketplace/*` (Nested routes for categories)
- **Seller**: `/seller/*` (Guarded by `ProtectedSellerRoute`)
- **Teacher**: `/teacher/*` (Guarded by `ProtectedTeacherRoute`)
- **Admin**: `/admin/*` (Guarded by `AdminProtectedRoute`)

Lazy loading (`React.lazy` + `Suspense`) is used for all page components to optimize initial load performance.
