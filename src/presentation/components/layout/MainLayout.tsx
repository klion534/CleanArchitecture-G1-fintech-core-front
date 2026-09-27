import React, { ReactNode } from 'react';
import { useAuthSession } from '../../hooks/useAuthSession';
import { Link } from 'react-router-dom';

export const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, session, logout } = useAuthSession();

  return (
    <div className="layout">
      <header className="navbar">
        <div className="nav-brand">
          <Link to="/" className="brand-mark">
            <span className="brand-icon">F</span>
            <span>Fintech Core</span>
          </Link>
        </div>
        <nav className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <span className="user-email">{session?.user?.email}</span>
              <button type="button" onClick={logout} className="btn-logout">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Iniciar Sesión</Link>
              <Link to="/register" className="nav-link">Registrarse</Link>
            </>
          )}
        </nav>
      </header>
      <main className="container">{children}</main>
    </div>
  );
};
