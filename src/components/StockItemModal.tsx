// src/components/StockItemModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  TextInput,
  FlatList,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { Text } from '@/components/Text';
import { Ionicons } from '@expo/vector-icons';
import { getStockItems, createStockItem } from '@/services/expenseService';
import { getToken } from '@/utils/tokenStorage';

// token_key needs to be stored in .env



export default function StockItemModal({ selectedItem, onSelect }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      setToken(await getToken('token_key'));
    };
    fetchToken();
  }, []);
  useEffect(() => {
    if (search.length > 1) {
      setLoading(true);
      getStockItems(search, token)
        .then(setResults)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setResults([]);
    }
  }, [search]);

  const handleCreate = async () => {
    try {
      const item = await createStockItem(search, token);
      onSelect(item);
      setModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View className="mt-2">
      <Pressable
        onPress={() => setModalVisible(true)}
        className="bg-gray-800 p-2 rounded">
        <Text className="text-white">
          {selectedItem ? selectedItem.name : 'Select or create item'}
        </Text>
      </Pressable>

      <Modal visible={modalVisible} animationType="slide">
        <View className="flex-1 bg-black p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl text-white">Search or Create Item</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>

          <TextInput
            className="bg-gray-800 text-white rounded p-2 mb-4"
            placeholder="Type item name"
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
                  onPress={() => {
                    onSelect(item);
                    setModalVisible(false);
                  }}
                  className="bg-gray-700 p-3 rounded mb-2">
                  <Text className="text-white">{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Pressable
              onPress={handleCreate}
              className="bg-blue-700 p-3 rounded">
              <Text className="text-white text-center">Create Item "{search}"</Text>
            </Pressable>
          )}
        </View>
      </Modal>
    </View>
  );
}
