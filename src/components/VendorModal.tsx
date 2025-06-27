// src/components/VendorModal.tsx
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
import { searchVendors, createVendor } from '@/services/vendorService';

export default function VendorModal({ vendor, setVendor }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search.length > 1) {
      setLoading(true);
      searchVendors(search)
        .then((data) => setResults(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setResults([]);
    }
  }, [search]);

  const handleCreate = async () => {
    try {
      const newVendor = await createVendor({ name: search });
      setVendor(newVendor);
      setModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View className="mt-4">
      <Text className="mb-2 text-white">Vendor</Text>

      <Pressable
        className="bg-gray-800 p-3 rounded"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white">
          {vendor ? vendor.name : 'Select or create vendor'}
        </Text>
      </Pressable>

      <Modal visible={modalVisible} animationType="slide">
        <View className="flex-1 bg-black p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl text-white">Search or Create Vendor</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>

          <TextInput
            className="bg-gray-800 text-white rounded p-2 mb-4"
            placeholder="Type vendor name"
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
                    setVendor(item);
                    setModalVisible(false);
                  }}
                  className="bg-gray-700 p-3 rounded mb-2"
                >
                  <Text className="text-white">{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Pressable onPress={handleCreate} className="bg-blue-700 p-3 rounded">
              <Text className="text-white text-center">Create Vendor "{search}"</Text>
            </Pressable>
          )}
        </View>
      </Modal>
    </View>
  );
}