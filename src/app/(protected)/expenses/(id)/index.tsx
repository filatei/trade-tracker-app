// src/app/(protected)/expenses/(id)/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';
import { Text } from '@/components/Text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import {
  getExpenseById,
  updateExpenseStatus,
  editExpense,
} from '@/services/expenseService';
import SectionHeader from './SectionHeader';
import Table from './Table';
import TableRow from './TableRow';
import ImageModal from '@/components/ImageModal';
import PayModal from '@/components/PayModal';
import NoteAddModal from '@/components/NoteAddModal';
import EditableFields from '@/components/EditableFields';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const STATUS_FLOW = ['DRAFT', 'VALIDATED', 'REVIEWED', 'APPROVED', 'PART-PAY', 'PAID'];

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const [expense, setExpense] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageToView, setImageToView] = useState<string | null>(null);
  const [payModalVisible, setPayModalVisible] = useState(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const translateY = useSharedValue(0);

  const swipeGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (e.translationY > 150) {
        runOnJS(router.back)();
      } else {
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const viewImage = (uri: string) => {
    setImageToView(uri);
    setImageModalVisible(true);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await getExpenseById(id);
        setExpense(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({
        tabBarStyle: {
          display: isEditing ? 'none' : 'flex',
        },
      });
    }
  }, [isEditing, navigation]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const updated = await updateExpenseStatus(id, newStatus);
      setExpense(updated);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const updateStatus = () => {
    const currentIndex = STATUS_FLOW.indexOf(expense.status);
    if (currentIndex < STATUS_FLOW.length - 1) {
      const nextStatus = STATUS_FLOW[currentIndex + 1];
      Alert.alert('Update Status', `Move to ${nextStatus}?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => handleStatusChange(nextStatus) },
      ]);
    }
  };

  const resetStatus = () => {
    Alert.alert('Reset to DRAFT?', 'Confirm status reset?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => handleStatusChange('DRAFT') },
    ]);
  };

  const handleSave = async (updatedData: any) => {
    try {
      const updated = await editExpense(id, updatedData);
      setExpense(updated);
      setIsEditing(false);
    } catch (e) {
      Alert.alert('Error', 'Failed to save updates');
    }
  };

  const cellText = (content: React.ReactNode) => <Text>{content}</Text>;

  if (loading || !expense) return null;

  return (
    <GestureDetector gesture={swipeGesture}>
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <SafeAreaView className="flex-1 bg-black pt-4">
          <View className="flex-row justify-between items-center px-4 pt-5">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-white text-3xl">×</Text>
            </TouchableOpacity>
            {expense.status === 'DRAFT' && (
              <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                <Text className="text-white text-xl">{isEditing ? '✎ Cancel' : '✎ Edit'}</Text>
              </TouchableOpacity>
            )}
            {['PAID', 'PART-PAY', 'APPROVED'].includes(expense.status) && (
              <TouchableOpacity onPress={resetStatus}>
                <Text className="text-white text-3xl">↺</Text>
              </TouchableOpacity>
            )}
          </View>

          {isEditing ? (
            <EditableFields
              expense={expense}
              onCancel={() => setIsEditing(false)}
              onSave={handleSave}
            />
          ) : (
            <ScrollView className="px-4">
              <View className="flex-row justify-between items-center mt-2">
                <Text className="text-white text-2xl font-bold">{expense.title}</Text>
                {['DRAFT', 'VALIDATED', 'REVIEWED'].includes(expense.status) && (
                  <TouchableOpacity onPress={updateStatus}>
                    <View className="bg-gray-600 px-2 py-1 rounded-full">
                      <Text className="text-white text-xs font-bold">{expense.status}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              <Text className="text-gray-400 text-sm mt-1 mb-2">
                Site: {expense.site} • #{expense.expense_id}
              </Text>

              {['APPROVED', 'PART-PAY'].includes(expense.status) && (
                <TouchableOpacity
                  className="bg-green-700 rounded-md px-4 py-2 self-start mb-2"
                  onPress={() => setPayModalVisible(true)}
                >
                  <Text className="text-white text-sm font-bold">Pay</Text>
                </TouchableOpacity>
              )}

              <Text className={`text-2xl font-bold ${expense.status === 'PART-PAY' ? 'text-yellow-400' : 'text-green-500'}`}>
                {expense.status === 'PART-PAY'
                  ? `Balance: ₦${(expense.balance || 0).toLocaleString()}`
                  : `₦${(expense.txn_amount || 0).toLocaleString()}`}
              </Text>

              <SectionHeader title="Products" />
              <Table headers={['SN', 'Name', 'Qty', 'Rate', 'Amount']}>
                {expense.products?.map((p: any, i: number) => (
                  <TableRow
                    key={p._id}
                    cells={[
                      cellText(i + 1),
                      cellText(p.name),
                      cellText(p.qty),
                      cellText(`₦${(p.price || 0).toLocaleString()}`),
                      cellText(`₦${(p.amount || p.qty * p.price).toLocaleString()}`),
                    ]}
                  />
                ))}
              </Table>

              <SectionHeader title="Payment History" />
              <Table headers={['Date', 'Amount', 'Memo', 'Receipt']}>
                {expense.payHistory?.map((ph: any) => (
                  <TableRow
                    key={ph._id}
                    cells={[
                      cellText(ph.paymentDate ? format(new Date(ph.paymentDate), 'MMM dd, yyyy') : 'N/A'),
                      cellText(`₦${(ph.paidAmount || 0).toLocaleString()}`),
                      cellText(ph.memo),
                      ph.image ? (
                        <TouchableOpacity onPress={() => viewImage(ph.image)}>
                          <Image source={{ uri: ph.image }} className="w-12 h-12 rounded" />
                        </TouchableOpacity>
                      ) : cellText('—'),
                    ]}
                  />
                ))}
              </Table>

              <View className="flex-row justify-between items-center mt-6 mb-2">
                <SectionHeader title="Notes" />
                <TouchableOpacity
                  onPress={() => setNoteModalVisible(true)}
                  className="bg-indigo-700 px-4 py-2 rounded-md"
                >
                  <Text className="text-white font-bold text-sm">Add Note</Text>
                </TouchableOpacity>
              </View>

              <Table headers={['Date', 'Note', 'Author', 'Receipt']}>
                {expense.notes?.map((n: any) => (
                  <TableRow
                    key={n._id}
                    cells={[
                      cellText(n.date ? format(new Date(n.date), 'MMM dd, yyyy') : 'N/A'),
                      cellText(n.text),
                      cellText(n.author),
                      n.image ? (
                        <TouchableOpacity onPress={() => viewImage(n.image)}>
                          <Image source={{ uri: n.image }} className="w-12 h-12 rounded" />
                        </TouchableOpacity>
                      ) : cellText('—'),
                    ]}
                  />
                ))}
              </Table>
            </ScrollView>
          )}

          {expense && (
            <NoteAddModal
              visible={noteModalVisible}
              onClose={() => setNoteModalVisible(false)}
              expenseId={expense._id}
              author={expense.creator?.name || 'Unknown'}
              onUpdate={(updated) => setExpense(updated)}
            />
          )}

          <ImageModal
            visible={imageModalVisible}
            uri={imageToView}
            onClose={() => setImageModalVisible(false)}
          />

          <PayModal
            visible={payModalVisible}
            onClose={() => setPayModalVisible(false)}
            expense={expense}
            onUpdate={(updated) => setExpense(updated)}
          />
        </SafeAreaView>
      </Animated.View>
    </GestureDetector>
  );
}
