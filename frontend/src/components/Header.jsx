import { NavLink } from 'react-router-dom';

export default function Header() {
  const linkClass = ({ isActive }) =>
    isActive ? 'nav-link active' : 'nav-link';

  return (
    <header style={{ borderBottom: '1px solid #eee' }}>
      <nav
        style={{
          display: 'flex',
          gap: 12,
          padding: 16,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <NavLink to='/' className={linkClass} end>
          Home
        </NavLink>
        <NavLink to='/about' className={linkClass}>
          About
        </NavLink>
        <NavLink to='/design' className={linkClass}>
          Design
        </NavLink>
        <NavLink to='/portfolio' className={linkClass}>
          Portfolio
        </NavLink>
      </nav>
    </header>
  );
}
