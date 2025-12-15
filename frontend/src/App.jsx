// src/App.jsx
// -------------------------------------------------------------
// This is the root component of the React app.
// It defines the main layout shared across all pages —
// including Header, Footer, and the dynamic content area (Outlet).
// -------------------------------------------------------------

import { Outlet, ScrollRestoration } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import BottomFooter from './components/BottomFooter.jsx';

// -------------------------------------------------------------
// Component: App
// -------------------------------------------------------------
export default function App() {
  return (
    // The top-level container for the entire app
    <div className='app'>
      {/* -------------------------------------------------------------
        Header:
        Appears on every page.
        Typically contains logo, navigation links, and sign-in info.
      ------------------------------------------------------------- */}
      <Header />

      {/* -------------------------------------------------------------
        Main Content:
        - <Outlet /> is a React Router component that renders the
          active route's content (e.g., Home, About, Contact, etc.)
        - <ScrollRestoration /> automatically restores scroll position
          when navigating between routes for better UX.
      ------------------------------------------------------------- */}
      <main>
        <Outlet />
        <ScrollRestoration />
      </main>

      {/* -------------------------------------------------------------
        Footer:
        Appears at the bottom of every page.
        Usually includes contact info, site links, and credits.
      ------------------------------------------------------------- */}
      <Footer />

      {/* -------------------------------------------------------------
        BottomFooter:
        Optional secondary footer, often used for legal notices,
        copyright, or small text below the main footer.
      ------------------------------------------------------------- */}
      <BottomFooter />
    </div>
  );
}
