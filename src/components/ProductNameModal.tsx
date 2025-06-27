// src/components/ProductNameModal.tsx
import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  TextInput,
  FlatList,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Text } from '@/components/Text';
import { Ionicons } from '@expo/vector-icons';
import { searchStockItems, createStockItem } from '@/services/stockService';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (name: string) => void;
}

export default function ProductNameModal({ visible, onClose, onSelect }: Props) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search.length > 1) {
      setLoading(true);
      searchStockItems(search)
        .then(setResults)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setResults([]);
    }
  }, [search]);

  const handleCreate = async () => {
    try {
      const newItem = await createStockItem({ name: search });
      onSelect(newItem.name);
    } catch (error) {
      console.error('Failed to create stock item:', error);
    } finally {
      onClose();
    }
  };

  const handleSelectItem = (item: any) => {
    onSelect(item.name);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <KeyboardAvoidingView
        className="flex-1 bg-black"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl text-white">Select or Create Product</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>

          <TextInput
            className="bg-gray-800 text-white rounded p-2 mb-4"
            placeholder="Type product name"
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
          />

          {results.length > 0 ? (
            <FlatList
              data={results}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectItem(item)}
                  className="bg-gray-700 p-3 rounded mb-2"
                >
                  <Text className="text-white">{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            search.length > 1 && (
              <Pressable
                onPress={handleCreate}
                className="bg-blue-700 p-3 rounded"
              >
                <Text className="text-white text-center">Create Product "{search}"</Text>
              </Pressable>
            )
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
