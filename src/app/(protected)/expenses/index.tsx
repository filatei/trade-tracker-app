// src/app/(protected)/expenses/index.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View, Pressable, FlatList, ActivityIndicator,
  RefreshControl, Animated, Alert, Text
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { getExpenses, deleteExpense } from '@/services/expenseService';
import { getSites } from '@/services/siteService';
import ExpenseSummary from '@/components/ExpenseSummary';
import ExpenseItem from '@/components/ExpenseItem';
import ExpenseHeader from '@/components/ExpenseHeader';
import DateRangeFilter from '@/components/DateRangeFilter';
import SiteFilter from '@/components/SiteFilter';
import UndoToast from '@/components/UndoToast';
import DatePickerModal from '@/components/DatePickerModal';
import useAnimatedToggle from '@/hooks/useAnimatedToggle';

interface Expense {
  _id: string;
  expense_id: number;
  title: string;
  status: string;
  site: string;
  category: string;
  txn_amount: number;
  balance: number;
  date: string;
  vendor: { name: string };
}

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [undoData, setUndoData] = useState<Expense | null>(null);
  const [search, setSearch] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [siteFilter, setSiteFilter] = useState('ALL');
  const siteFilterToggle = useAnimatedToggle(false, 80);
  const dateFilterToggle = useAnimatedToggle(false, 120);

  const [siteOptions, setSiteOptions] = useState<{ label: string; value: string }[]>([]);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const undoTimer = useRef<NodeJS.Timeout | null>(null);
  const [siteFilterWasVisible, setSiteFilterWasVisible] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'start' | 'end'>('start');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    getSites().then(sites => {
      const formatted = sites.map(s => ({ label: s.name, value: s.name }));
      setSiteOptions([{ label: 'All Sites', value: 'ALL' }, ...formatted]);
      if (!siteFilter) setSiteFilter('ALL');
    });
  }, []);

  const showDatePicker = (mode: 'start' | 'end') => {
    setDatePickerMode(mode);
    setShowDatePickerModal(true);
  };

  const loadExpenses = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);
    if (reset) setLoadingInitial(true);

    try {
      const fetchPage = reset ? 1 : page;
      const list = await getExpenses({
        page: fetchPage,
        search,
        ...(siteFilter !== 'ALL' && { site: siteFilter }),
        ...(startDate && { startDate: startDate.toISOString() }),
        ...(endDate && { endDate: endDate.toISOString() }),
      });
      setExpenses(prev => reset ? list : [...prev, ...list]);
      setPage(reset ? 2 : fetchPage + 1);
      if (list.length < 10) setHasMore(false);
    } catch (e) {
      console.error('Failed to load expenses', e);
    } finally {
      setLoading(false);
      if (reset) setLoadingInitial(false);
    }
  };

  useEffect(() => {
    loadExpenses(true);
  }, [search, siteFilter, startDate, endDate]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadExpenses(true);
    setRefreshing(false);
  };

  const showSearch = () => {
    setSiteFilterWasVisible(siteFilterToggle.visible);
    siteFilterToggle.hide();
    setSearchVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideSearch = () => {
    setSearchVisible(false);
    setSearch('');
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start();
    if (siteFilterWasVisible) siteFilterToggle.show();
    loadExpenses(true);
  };

  const undoDelete = () => {
    if (undoData) {
      setExpenses(prev => [undoData!, ...prev]);
      setUndoData(null);
    }
  };

  const confirmDelete = (item: Expense) => {
    if (item.status !== 'DRAFT') return;
    Alert.alert('Delete Draft?', 'Are you sure you want to delete this expense?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          setExpenses(prev => prev.filter(e => e._id !== item._id));
          setUndoData(item);
          undoTimer.current = setTimeout(async () => {
            try {
              await deleteExpense(item._id);
            } catch (err) {
              console.error('Delete failed', err);
              setExpenses(prev => [item, ...prev]);
            } finally {
              setUndoData(null);
            }
          }, 5000);
        }
      }
    ]);
  };

  const { total, pending, approved } = useMemo(() => {
    const safe = expenses || [];
    const num = (v: any) => isNaN(Number(v)) ? 0 : Number(v);
    return {
      total: safe.reduce((s, e) => s + num(e.txn_amount), 0),
      pending: safe.filter(e => ['DRAFT', 'VALIDATED', 'REVIEWED'].includes(e.status)).reduce((s, e) => s + num(e.txn_amount), 0),
      approved: safe.filter(e => e.status === 'APPROVED').reduce((s, e) => s + num(e.txn_amount), 0),
    };
  }, [expenses]);

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView className="bg-black" edges={['top']}>
        <ExpenseHeader
          searchVisible={searchVisible}
          search={search}
          setSearch={setSearch}
          showSearch={showSearch}
          hideSearch={hideSearch}
          slideAnim={slideAnim}
          toggleSiteFilter={siteFilterToggle.toggle}
          toggleDateFilter={dateFilterToggle.toggle}
          goToCreate={() => router.push('/expenses/create')}
        />

        <Animated.View style={{ height: siteFilterToggle.animValue, overflow: 'hidden' }}>
          <SiteFilter
            selectedSite={siteFilter}
            onChange={val => setSiteFilter(val)}
            siteOptions={siteOptions}
          />
        </Animated.View>

        <Animated.View style={{ height: dateFilterToggle.animValue, overflow: 'hidden' }}>
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            showDatePicker={showDatePicker}
            onClear={() => {
              const hadDate = startDate || endDate;
              setStartDate(null);
              setEndDate(null);
              if (hadDate) loadExpenses(true);
            }}
            onApply={() => {
              flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
              loadExpenses(true);
            }}
          />
        </Animated.View>
      </SafeAreaView>

      <FlatList
        data={expenses}
        keyExtractor={(item, i) => `${item._id}-${i}`}
        ref={flatListRef}
        renderItem={({ item }) => <ExpenseItem item={item} onDelete={confirmDelete} onEdit={() => router.push({ pathname: '/expenses/(id)', params: { id: item._id } })} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={() => !loading && hasMore && loadExpenses()}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={<ExpenseSummary total={total} pending={pending} approved={approved} />}
        ListFooterComponent={loading ? <ActivityIndicator color="white" className="my-4" /> : null}
        contentContainerStyle={{ padding: 16, gap: 16 }}
      />

      <UndoToast visible={!!undoData} onUndo={undoDelete} />

      <DatePickerModal
        visible={showDatePickerModal}
        mode={datePickerMode}
        currentDate={datePickerMode === 'start' ? startDate || new Date() : endDate || new Date()}
        onClose={() => setShowDatePickerModal(false)}
        onChange={selectedDate => {
          if (datePickerMode === 'start') setStartDate(selectedDate);
          else setEndDate(selectedDate);
        }}
      />
    </View>
  );
}