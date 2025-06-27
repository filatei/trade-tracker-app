import React from 'react';
import { View, Text, TextInput, Pressable, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import SearchBar from './SearchBar';


interface ExpenseHeaderProps {
  searchVisible: boolean;
  slideAnim: Animated.Value;
  search: string;
  setSearch: (val: string) => void;
  showSearch: () => void;
  hideSearch: () => void;
  toggleSiteFilter: () => void;
  toggleDateFilter: () => void;
  goToCreate: () => void;
}

const ExpenseHeader: React.FC<ExpenseHeaderProps> = ({
  searchVisible,
  slideAnim,
  search,
  setSearch,
  showSearch,
  hideSearch,
  toggleSiteFilter,
  toggleDateFilter,
  goToCreate,
}) => {
  return (
    <View className="flex-row justify-between items-center px-4 py-3">
      {!searchVisible && (
        <Text className="text-2xl font-bold text-white">Expenses</Text>
      )}

        <SearchBar
            searchVisible={searchVisible}
            search={search}
            setSearch={setSearch}
            slideAnim={slideAnim}
            onHide={hideSearch}
        />

      <View className="flex-row items-center">
        {/* ✅ ADD DATE FILTER BUTTON HERE */}
        <Pressable onPress={toggleDateFilter} className="p-2 mr-2">
          <Ionicons name="calendar-outline" size={20} color="#fff" />
        </Pressable>

        <Pressable onPress={toggleSiteFilter} className="p-2 mr-2">
          <Ionicons name="filter-outline" size={20} color="#fff" />
        </Pressable>

        {!searchVisible && (
          <Pressable onPress={showSearch} className="p-2 mr-2">
            <Ionicons name="search-outline" size={18} color="#fff" />
          </Pressable>
        )}

        <Pressable onPress={goToCreate} className="p-2">
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

export default ExpenseHeader;