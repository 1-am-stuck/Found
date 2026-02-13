# Campus FOUND System - Frontend

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
   - Create a `.env` file in the frontend directory
   - Add your Google OAuth Client ID:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
   REACT_APP_GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

3. **Run the development server:**
```bash
npm start
```

The app will open at `http://localhost:3000`

## Features

- **Login**: Google OAuth authentication
- **Home**: Interactive map showing all found items
- **Report Found**: Form to report a found item with map location selection
- **Found Items List**: Browse and filter found items
- **Item Detail**: View item details and claim items
- **Admin Dashboard**: Manage items and verify claims (admin only)

## Mobile-Style UI

The interface is designed with a mobile-first approach:
- Responsive layout that works on all screen sizes
- Touch-friendly buttons and inputs
- Clean, minimal design
- Easy navigation

