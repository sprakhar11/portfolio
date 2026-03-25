import { useState } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

export const AdminPage = () => {
  const [token, setToken] = useState(sessionStorage.getItem('gh_token') || '');
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  const handleAuth = (t, u) => {
    setToken(t);
    setUser(u);
    setAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('gh_token');
    setToken('');
    setUser(null);
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <AdminLogin onAuth={handleAuth} />;
  }

  return <AdminDashboard token={token} user={user} onLogout={handleLogout} />;
};
