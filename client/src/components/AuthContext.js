import { createContext, useContext, useState } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Create a provider component
export function AuthProvider({ children }) {
    const [userRole, setUserRole] = useState(null);

    return (
        <AuthContext.Provider value={{ userRole, setUserRole }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook for easy access
export function useAuth() {
    return useContext(AuthContext);
}
