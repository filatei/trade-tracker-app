// components/DatePickerModal.tsx
import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DatePickerModalProps {
  visible: boolean;
  mode: 'start' | 'end';
  currentDate: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  mode,
  currentDate,
  onChange,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <DateTimePicker
      value={currentDate}
      mode="date"
      display="default"
      onChange={(event, selectedDate) => {
        onClose();
        if (selectedDate) {
          onChange(selectedDate);
        }
      }}
    />
  );
};

export default DatePickerModal;