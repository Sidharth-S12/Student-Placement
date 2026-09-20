import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginUser,
  registerUser,
  logoutUser,
  sendPasswordReset,
  subscribeToAuthState,
  fetchUserRole
} from '../services/authService';

const AuthContext = createContext();

const ACTIVE_SESSION_KEY = 'placement_genie_active_session';
const PREFERRED_LOGIN_ROLE_KEY = 'preferredLoginRole';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Load remembered preferred portal from storage (null for first-time users)
  const [selectedRole, setSelectedRoleState] = useState(() => {
    try {
      return localStorage.getItem(PREFERRED_LOGIN_ROLE_KEY) || null;
    } catch (e) {
      return null;
    }
  });

  const setSelectedRole = (role) => {
    setSelectedRoleState(role);
    try {
      if (role) {
        localStorage.setItem(PREFERRED_LOGIN_ROLE_KEY, role);
      }
    } catch (e) {
      console.warn('Error saving preferred login role:', e);
    }
  };

  // Sync auth state on application startup
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = subscribeToAuthState(async (user) => {
      if (!isMounted) return;

      if (user) {
        try {
          const verifiedRole = await fetchUserRole(user.uid, user.email);
          if (isMounted) {
            setCurrentUser(user);
            setUserRole(verifiedRole);
            localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              role: verifiedRole
            }));

            if (import.meta.env.DEV) {
              console.log(`[Auth Diagnostic]\n=========================================\nAuthenticated user: ${user.email}\nUID: ${user.uid}\nRole: ${verifiedRole}\n=========================================`);
            }
          }
        } catch (e) {
          console.warn('Error fetching user role on state restore:', e);
          if (isMounted) {
            setCurrentUser(user);
            setUserRole('student');
          }
        }
      } else {
        if (isMounted) {
          setCurrentUser(null);
          setUserRole(null);
          localStorage.removeItem(ACTIVE_SESSION_KEY);
        }
      }

      if (isMounted) {
        setAuthLoading(false);
      }
    });

    return () => {
      isMounted = false;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { user, role } = await loginUser(email, password);
    setCurrentUser(user);
    setUserRole(role);
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role
    }));

    if (import.meta.env.DEV) {
      console.log(`[Auth Diagnostic]\n=========================================\nAuthenticated user: ${user.email}\nUID: ${user.uid}\nRole: ${role}\n=========================================`);
    }

    return { user, role };
  };

  const register = async (userData) => {
    const { user, role } = await registerUser(userData);
    setCurrentUser(user);
    setUserRole(role);
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role
    }));
    return { user, role };
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn('Error logging out:', e);
    } finally {
      setCurrentUser(null);
      setUserRole(null);
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userRole,
        authLoading,
        selectedRole,
        setSelectedRole,
        login,
        register,
        logout,
        sendPasswordReset
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
