// components/SearchBar.tsx
import React from 'react';
import { Animated, View, TextInput, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface SearchBarProps {
  searchVisible: boolean;
  search: string;
  setSearch: (text: string) => void;
  slideAnim: Animated.Value;
  onHide: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchVisible,
  search,
  setSearch,
  slideAnim,
  onHide,
}) => {
  if (!searchVisible) return null;

  return (
    <Animated.View
      style={{ transform: [{ translateX: slideAnim }] }}
      className="flex-row items-center p-2 rounded-lg bg-gray-800"
    >
      <MaterialCommunityIcons name="magnify" size={20} color="#888" />
      <TextInput
        placeholder="Search expenses..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
        className="ml-2 flex-1 text-white"
      />
      <Pressable onPress={onHide}>
        <Ionicons name="close" size={20} color="#888" />
      </Pressable>
    </Animated.View>
  );
};

export default SearchBar;