import { useMemo, useState } from 'react';
import { demoUsers } from '../data/mockData';
import { AuthContext } from './authContextObject';

const USER_KEY = 'adani_demo_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  const login = ({ email, role }) => {
    const validatedRole = ['agent', 'supervisor', 'admin'].includes(role) ? role : 'agent';
    const template = demoUsers[validatedRole];
    const nextUser = {
      ...template,
      email,
      role: validatedRole,
    };
    setUser(nextUser);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    return nextUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
