import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);

  const refreshRole = useCallback(async () => {
    setRoleLoading(true);

    try {
      const { data, error } = await supabase.rpc("admin_role");

      if (error) {
        throw error;
      }

      const nextRole = data || null;
      setRole(nextRole);
      return nextRole;
    } finally {
      setRoleLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;

      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession ?? null);

        if (!nextSession) {
          setRole(null);
        }
      },
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    if (!session?.user) {
      setRole(null);
      return;
    }

    refreshRole().catch(() => {
      setRole(null);
    });
  }, [loading, session?.user?.id, refreshRole]);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    setSession(data.session ?? null);

    const { data: adminRole, error: roleError } = await supabase.rpc(
      "admin_role",
    );

    if (roleError) {
      await supabase.auth.signOut();
      throw roleError;
    }

    if (!adminRole) {
      await supabase.auth.signOut();
      throw new Error("This account is not authorized for the SVGOR admin portal.");
    }

    setRole(adminRole);
    return adminRole;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setRole(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      role,
      isAdmin: Boolean(role),
      canEdit: role === "super_admin" || role === "editor",
      loading: loading || roleLoading,
      signIn,
      signOut,
      refreshRole,
    }),
    [session, role, loading, roleLoading, signIn, signOut, refreshRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return value;
}
