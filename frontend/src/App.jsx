import { Outlet } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import './App.css';

export default function App() {
  return (
    <div
      className='app'
      style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}
    >
      <Header />
      <main style={{ padding: 16, flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
