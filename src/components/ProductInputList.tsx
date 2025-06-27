// src/components/ProductInputList.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductNameModal from './ProductNameModal';

export default function ProductInputList({ 
  products, 
  setProducts 
}: { 
  products: any[], 
  setProducts: (items: any[] | ((prev: any[]) => any[])) => void 
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempNameIndex, setTempNameIndex] = useState<number | null>(null);

  const handleSelect = (name: string) => {
    if (tempNameIndex !== null) {
      const updated = [...products];
      updated[tempNameIndex].name = name;
      setProducts(updated);
      setTempNameIndex(null);
      setModalVisible(false);
    }
  };

  const updateQty = (index: number, value: string) => {
    const qty = parseFloat(value);
    const updated = [...products];
  
    if (!isNaN(qty)) {
      updated[index].qty = qty;
      const price = updated[index].price || 0;
      updated[index].amount = qty * price;
      setProducts(updated);
    }
  };
  
  const updatePrice = (index: number, value: string) => {
    const price = parseFloat(value);
    const updated = [...products];
  
    if (!isNaN(price)) {
      updated[index].price = price;
      const qty = updated[index].qty || 0;
      updated[index].amount = qty * price;
      setProducts(updated);
    }
  };

  const addProduct = () => {
    setProducts(prev => [...prev, { name: '', qty: 1, price: 0 }]);
    setTempNameIndex(products.length);
    setModalVisible(true);
  };

  const removeProduct = (index: number) => {
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);
  };

  return (
    <View className="mt-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-white text-lg">Products</Text>
        <Pressable onPress={addProduct} className="bg-green-700 p-2 rounded-full">
          <Ionicons name="add" size={20} color="white" />
        </Pressable>
      </View>

      {products.length === 0 ? (
        <Text className="text-gray-400">No products added yet</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View className="bg-gray-800 p-3 rounded mb-2">
              <Pressable onPress={() => { setTempNameIndex(index); setModalVisible(true); }}>
                <Text className="text-white mb-2 text-base font-semibold">
                  {item.name || 'Select Product'}
                </Text>
              </Pressable>
              <View className="flex-row justify-between">
                <TextInput
                  className="bg-gray-700 text-white rounded px-2 w-1/2 mr-2"
                  keyboardType="numeric"
                  placeholder="Qty"
                  placeholderTextColor="#ccc"
                  value={item.qty?.toString() || ''}
                  onChangeText={(val) => updateQty(index, val)}
                />
                <TextInput
                  className="bg-gray-700 text-white rounded px-2 w-1/2"
                  keyboardType="numeric"
                  placeholder="Price"
                  placeholderTextColor="#ccc"
                  value={item.price?.toString() || ''}
                  onChangeText={(val) => updatePrice(index, val)}
                />
              </View>
              <Pressable onPress={() => removeProduct(index)} className="mt-2">
                <Text className="text-red-400 text-sm">Remove</Text>
              </Pressable>
            </View>
          )}
        />
      )}

      <ProductNameModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleSelect}
      />
    </View>
  );
}
