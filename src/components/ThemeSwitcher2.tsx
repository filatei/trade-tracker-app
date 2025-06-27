// import React from 'react';
// import { Pressable } from 'react-native';
// import { useTheme } from '@/context/ThemeContext';
// import { Ionicons } from '@expo/vector-icons';
// import { Link } from 'expo-router';


// export default function ThemeSwitcher() {
//   const { theme, toggleTheme } = useTheme();

//   return (
//     <Pressable 
//       onPress={toggleTheme} 
//       className={`p-2 mr-2 rounded-lg ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}
//     >
//       <Ionicons
//         name={theme === 'light' ? 'moon-outline' : 'sunny-outline'}
//         size={18}
//         color={theme === 'light' ? '#1a1a1a' : '#ffffff'}
//       />
//     </Pressable>
//   );
// } 