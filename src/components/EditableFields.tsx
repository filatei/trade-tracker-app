import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Pressable, KeyboardAvoidingView, FlatList, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductInputList from '@/components/ProductInputList';
import VendorModal from '@/components/VendorModal';
import CategorySelector from '@/components/CategorySelector';
import SiteSelector from '@/components/SiteSelector';

interface EditableFieldsProps {
  expense: any;
  onCancel: () => void;
  onSave: (updated: Partial<any>) => void;
}

export default function EditableFields({
  expense,
  onCancel,
  onSave,
}: EditableFieldsProps) {
  const [title, setTitle] = useState(expense.title);
  const [category, setCategory] = useState(expense.category);
  const [site, setSite] = useState(expense.site);
  const [vendor, setVendor] = useState(expense.vendor);
  const [products, setProducts] = useState(expense.products);

  useEffect(() => {
  }, [title, category, site, vendor, products]);

  const renderHeader = () => (
    <View className="mb-6 px-4">
      <View className="flex-row justify-end mt-4 space-x-2">
        <Pressable onPress={onCancel} className="bg-red-600 px-4 py-2 rounded">
          <Text className="text-white">Cancel</Text>
        </Pressable>
        <Pressable
          onPress={() => onSave({ title, category, site, vendor, products })}
          className="bg-green-600 px-4 py-2 rounded"
        >
          <Text className="text-white">Save</Text>
        </Pressable>
      </View>
      <Text className="text-white mt-4 mb-1">Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        className="bg-gray-800 text-white rounded-lg p-2"
        placeholder="Enter title"
        placeholderTextColor="#aaa"
      />

      <SiteSelector value={site} onChange={setSite} />

      <CategorySelector value={category} onChange={setCategory} />

      <VendorModal vendor={vendor} setVendor={setVendor} />

      <Text className="text-lg text-white mt-2">
        Total: ₦{products.reduce((acc, p) => acc + p.qty * p.price, 0).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          data={[]}
          renderItem={null}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={
            <View className="px-4 pb-24">
              <ProductInputList products={products} setProducts={setProducts} />
            </View>
          }
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}