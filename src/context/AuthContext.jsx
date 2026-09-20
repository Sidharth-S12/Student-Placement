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
  const [authError, setAuthError] = useState(null);

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
            if (verifiedRole) {
              setCurrentUser(user);
              setUserRole(verifiedRole);
              setAuthError(null);
              localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                role: verifiedRole
              }));

              if (import.meta.env.DEV) {
                console.log(`[AUTH DIAGNOSTIC]\n=========================================\nFirebase UID: ${user.uid}\nEmail: ${user.email}\nPersisted Role: ${verifiedRole}\nAuthorization: ALLOWED\n=========================================`);
              }
            } else {
              // Role missing: NEVER DEFAULT TO STUDENT
              setCurrentUser(user);
              setUserRole(null);
              setAuthError("Unable to determine account role. Please try again or contact support.");
              localStorage.removeItem(ACTIVE_SESSION_KEY);
              console.error(`[AUTH DIAGNOSTIC] Role resolution failed for UID: ${user.uid} (${user.email}). No fallback applied.`);
            }
          }
        } catch (e) {
          console.warn('Error fetching user role on state restore:', e);
          if (isMounted) {
            setCurrentUser(user);
            setUserRole(null);
            setAuthError("Unable to determine account role. Please try again.");
            localStorage.removeItem(ACTIVE_SESSION_KEY);
          }
        }
      } else {
        if (isMounted) {
          setCurrentUser(null);
          setUserRole(null);
          setAuthError(null);
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
    setAuthError(null);
    const { user, role } = await loginUser(email, password);

    if (!role) {
      setCurrentUser(user);
      setUserRole(null);
      setAuthError("Unable to determine account role. Please contact support.");
      return { user, role: null };
    }

    setCurrentUser(user);
    setUserRole(role);
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role
    }));

    if (import.meta.env.DEV) {
      console.log(`[AUTH DIAGNOSTIC]\n=========================================\nFirebase UID: ${user.uid}\nEmail: ${user.email}\nPersisted Role: ${role}\nAuthorization: ALLOWED\n=========================================`);
    }

    return { user, role };
  };

  const register = async (userData) => {
    setAuthError(null);
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
      setAuthError(null);
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userRole,
        authLoading,
        authError,
        setAuthError,
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
