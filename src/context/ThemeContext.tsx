// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useColorScheme } from 'react-native';

// type Theme = 'light' | 'dark';

// interface ThemeContextType {
//   theme: Theme;
//   toggleTheme: () => void;
// }

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// export function ThemeProvider({ children }: { children: React.ReactNode }) {
//   const systemColorScheme = useColorScheme();
//   const [theme, setTheme] = useState<Theme>(systemColorScheme || 'dark');

//   useEffect(() => {
//     if (systemColorScheme) {
//       setTheme(systemColorScheme);
//     }
//   }, [systemColorScheme]);

//   const toggleTheme = () => {
//     setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
//   };

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

// export function useTheme() {
//   const context = useContext(ThemeContext);
//   if (context === undefined) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// } 