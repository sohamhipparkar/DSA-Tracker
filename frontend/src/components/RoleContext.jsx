import { createContext, useContext, useEffect, useState } from "react";

const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [role, setRole] = useState(null); // "admin" | "user" | null

  // Load role on startup
  useEffect(() => {
    const savedRole = sessionStorage.getItem("role");
    if (savedRole) setRole(savedRole);
  }, []);

  // choose role
  const chooseRole = (selectedRole) => {
    sessionStorage.setItem("role", selectedRole);
    setRole(selectedRole);
  };

  // 🔥 NEW: allow re-opening selector
  const resetRole = () => {
    sessionStorage.removeItem("role");
    setRole(null);
  };

  return (
    <RoleContext.Provider value={{ role, chooseRole, resetRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
