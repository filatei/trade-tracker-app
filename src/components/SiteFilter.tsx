// components/SiteFilter.tsx
import React from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface SiteFilterProps {
  selectedSite: string;
  onChange: (val: string) => void;
  siteOptions: { label: string; value: string }[];
}

const SiteFilter: React.FC<SiteFilterProps> = ({ selectedSite, onChange, siteOptions }) => {
  return (
    <View className="px-4">
      <View className="bg-gray-800 rounded">
        <Picker
          selectedValue={selectedSite}
          onValueChange={(val) => onChange(val)}
          dropdownIconColor="#fff"
          style={{ color: 'white' }}
        >
          {siteOptions.map((site) => (
            <Picker.Item key={site.value} label={site.label} value={site.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default SiteFilter;