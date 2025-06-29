import React from 'react';
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Button,
} from 'react-native';
import Toast from 'react-native-toast-message';

interface TargetSelectorModalProps {
  visible: boolean;
  targets: any[];
  selectedTargetId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function TargetSelectorModal({
  visible,
  targets,
  selectedTargetId,
  onSelect,
  onClose,
}: TargetSelectorModalProps) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-white p-4">
        <Text className="text-lg font-bold mb-4">🎯 Select Target</Text>

        {targets.length === 0 ? (
          <Text>No targets found.</Text>
        ) : (
          <FlatList
            data={targets}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onSelect(item._id);
                  onClose();
                  Toast.show({
                    type: 'info',
                    text1: 'Target Switched',
                    text2: item.targetAmount.toLocaleString(),
                  });
                }}
                className={`p-4 border-b ${
                  item._id === selectedTargetId
                    ? 'bg-blue-100 border-blue-500'
                    : 'border-gray-200'
                }`}
              >
                <Text className="text-base font-semibold">🎯 ${item.targetAmount.toLocaleString()}</Text>
                <Text className="text-sm text-gray-500">Start: {new Date(item.startDate).toDateString()}</Text>
                <Text className="text-sm text-gray-500">Ends: {new Date(item.targetDate).toDateString()}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <View className="mt-4">
          <Button title="Close" onPress={onClose} />
        </View>
      </SafeAreaView>
    </Modal>
  );
}