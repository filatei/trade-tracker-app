// components/UndoToast.tsx
import React from 'react';
import { Pressable, Text } from 'react-native';

interface UndoToastProps {
  visible: boolean;
  onUndo: () => void;
}

const UndoToast: React.FC<UndoToastProps> = ({ visible, onUndo }) => {
  if (!visible) return null;

  return (
    <Pressable
      onPress={onUndo}
      className="absolute bottom-4 left-4 right-4 bg-yellow-500 p-3 rounded-lg items-center"
    >
      <Text className="text-black font-bold">Undo Delete</Text>
    </Pressable>
  );
};

export default UndoToast;