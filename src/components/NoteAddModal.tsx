// src/components/NoteAddModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { updateExpenseNote } from '@/services/expenseService';

interface NoteModalProps {
  visible: boolean;
  onClose: () => void;
  expenseId: string;
  author: string;
  onUpdate: (updated: any) => void;
}

export default function NoteAddModal({ visible, onClose, expenseId, author, onUpdate }: NoteModalProps) {
  const [note, setNote] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!note.trim()) {
      return Alert.alert('Validation', 'Note text is required.');
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('action', 'note');
      formData.append('noteText', note);
      formData.append('noteAuthor', author);

      if (imageUri) {
        const filename = imageUri.split('/').pop() || 'note.jpg';
        const type = `image/${filename.split('.').pop()}`;
        formData.append('receipt', {
          uri: imageUri,
          name: filename,
          type,
        } as any);
      }

      const res = await updateExpenseNote(expenseId, formData);
      Toast.show({ type: 'success', text1: 'Note added successfully' });
      onUpdate(res.expense);
      setNote('');
      setImageUri(null);
      onClose();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to add note.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView className="flex-1 bg-black px-4 py-6">
        <Text className="text-white text-xl font-bold mb-4">Add Note</Text>

        <TextInput
          className="bg-gray-900 text-white border border-gray-700 rounded-lg p-2 mb-4"
          placeholder="Enter your note"
          placeholderTextColor="#888"
          multiline
          numberOfLines={4}
          value={note}
          onChangeText={setNote}
        />

        <TouchableOpacity
          className="bg-gray-700 rounded-lg p-3 mb-4"
          onPress={pickImage}
        >
          <Text className="text-white text-center">
            {imageUri ? 'Change Image' : 'Attach Image'}
          </Text>
        </TouchableOpacity>

        {imageUri && (
          <Text className="text-white text-sm mb-4">✅ Image selected</Text>
        )}

        <TouchableOpacity
          className={`rounded-lg p-3 ${loading ? 'bg-gray-500' : 'bg-green-600'}`}
          disabled={loading}
          onPress={handleSubmit}
        >
          <Text className="text-white text-center font-bold">
            {loading ? 'Submitting...' : 'Submit Note'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="mt-4" onPress={onClose}>
          <Text className="text-red-500 text-center">Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
}
