import { Outlet, ScrollRestoration } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import BottomFooter from './components/BottomFooter.jsx';
import { ToastContainer } from 'react-toastify'; // lesson 6
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <div className='app'>
      <Header />
      <main>
        <Outlet />
        <ScrollRestoration />
        <ToastContainer position='bottom-center' limit={1} />
      </main>
      <Footer />
      <BottomFooter />
    </div>
  );
}

// If you want to review the commented teaching version of the App.jsx setup, check commit lesson-04.
// lesson-06 ToastContainer
