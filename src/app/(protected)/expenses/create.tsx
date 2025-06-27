// src/app/(protected)/expenses/create.tsx
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable,
  FlatList,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useNavigation } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { Text } from '@/components/Text';
import Animated, { FadeInDown } from 'react-native-reanimated';
import SubmitButton from '@/components/SubmitButton';
import ProductInputList from '@/components/ProductInputList';
import VendorModal from '@/components/VendorModal';
import CategorySelector from '@/components/CategorySelector';
import AccountSelector from '@/components/AccountSelector';
import SiteSelector from '@/components/SiteSelector';
import { createExpense } from '@/services/expenseService';
import { useAuthStore } from '@/store/authStore';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function CreateExpenseScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [vendor, setVendor] = useState(null);
  const [total, setTotal] = useState(0);
  const [images, setImages] = useState<any[]>([]);
  const [siteLabel, setSiteLabel] = useState('');

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      title: '',
      remarks: '',
      category: '',
      account: '',
      site: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const sum = products.reduce((acc, item) => acc + (item.qty * item.price), 0);
    setTotal(sum);
  }, [products]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerRight: () => (
        <View className="flex-row items-center">
          <Pressable onPress={prefillForm} className="mr-4">
            <Ionicons name="flask" size={20} color="white" />
          </Pressable>
          <Pressable onPress={() => router.back()} className="mr-4">
            <Text>Cancel</Text>
          </Pressable>
          <SubmitButton
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || !vendor || products.length === 0 || total <= 0}
          />
        </View>
      ),
    });
  }, [isValid, vendor, products, total]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.1,
      selectionLimit: 5, // optional limit
    });
  
    if (!result.canceled && result.assets.length > 0) {
      const selectedImages = result.assets.map((file) => ({
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.fileName || `image-${Date.now()}.jpg`,
      }));
  
      setImages((prev) => [...prev, ...selectedImages]);
    }
  };

  const prefillForm = () => {
    setValue('title', 'Test Expense');
    setValue('remarks', 'Generated for testing');
    setValue('category', 'Transportation');
    setValue('account', 'Cash');
    setValue('site', 'KPANSIA');
    setSiteLabel('KPANSIA');
    setProducts([{ name: 'DIESEL', qty: 10, price: 500 }]);
  };

  const onSubmit = async (data) => {
    if (!vendor || products.length === 0 || total <= 0) {
      Alert.alert('Missing Fields', 'Please complete all required fields');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('remarks', data.remarks);
      formData.append('category', data.category);
      formData.append('account', data.account);
      formData.append('site', siteLabel);
      formData.append('vendor', vendor._id);
      formData.append('products', JSON.stringify(products));
      formData.append('txn_amount', String(total));
      formData.append('date', new Date().toISOString());

      images.forEach((img) => {
        formData.append('images', {
          uri: img.uri,
          type: img.type,
          name: img.name,
        } as any);
      });

      await createExpense(formData);
      Alert.alert('Success', 'Expense created successfully');
      router.back();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to create expense');
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-black"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="light" backgroundColor="#000" />

      <FlatList
        ListHeaderComponent={<>
          <Animated.View entering={FadeInDown}>
            <Text className="mb-2">* Enter Title</Text>
            <Controller
              control={control}
              name="title"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="bg-gray-800 text-white rounded-lg p-2"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter title"
                  placeholderTextColor="#aaa"
                />
              )}
            />
          </Animated.View>

          <ProductInputList products={products} setProducts={setProducts} />

          <Text className="mt-4 text-lg">Total: ₦{total.toFixed(2)}</Text>

          <CategorySelector control={control} />
          <AccountSelector control={control} />
          <Controller
            control={control}
            name="site"
            render={({ field: { onChange, value } }) => (
              <SiteSelector 
                value={value} 
                onChange={onChange} 
                setSiteLabel={setSiteLabel} 
              />
            )}
          />
          <VendorModal vendor={vendor} setVendor={setVendor} />

          <Animated.View entering={FadeInDown}>
            <Text className="mt-4 mb-2">Remarks</Text>
            <Controller
              control={control}
              name="remarks"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="bg-gray-800 text-white rounded-lg p-2 h-24 text-start"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Optional remarks"
                  multiline
                  placeholderTextColor="#aaa"
                />
              )}
            />
          </Animated.View>

          <Pressable onPress={pickImage} className="mt-4 bg-blue-700 p-3 rounded">
            <Text className="text-white text-center">Attach Image</Text>
          </Pressable>

          {images.length > 0 && (
            <FlatList
              data={images}
              horizontal
              keyExtractor={(item, index) => `${index}`}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item.uri }}
                  className="w-32 h-32 mr-2 mt-4 rounded-lg"
                  resizeMode="cover"
                />
              )}
            />
          )}
        </>}
        data={[]}
        renderItem={null}
        keyExtractor={() => 'empty'}
      />
    </KeyboardAvoidingView>
  );
}
