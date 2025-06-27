// src/components/CategorySelector.tsx
import React from 'react';
import DarkPicker from './DarkPicker';

interface CategorySelectorProps {
  control?: any; // for form use
  value?: string; // for controlled component use
  onChange?: (value: string) => void;
}

const categoryOptions = [
  { label: 'Fuel', value: 'Fuel' },
  { label: 'Transportation', value: 'Transportation' },
  { label: 'Maintenance', value: 'Maintenance' },
  { label: 'Utilities', value: 'Utilities' },
  { label: 'Supplies', value: 'Supplies' },
  { label: 'Others', value: 'Others' },
];

export default function CategorySelector({
  control,
  value,
  onChange,
}: CategorySelectorProps) {
  return (
    <DarkPicker
      label="Category"
      name="category"
      control={control}
      value={value}
      onChange={onChange}
      options={categoryOptions}
    />
  );
}