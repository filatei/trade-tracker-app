// src/components/SiteSelector.tsx
import React, { useEffect, useState } from 'react';
import DarkPicker from './DarkPicker';
import { getSites } from '@/services/siteService';

interface SiteSelectorProps {
  value: string;
  onChange: (value: string) => void;
  setSiteLabel?: (label: string) => void;
}

export default function SiteSelector({ value, onChange, setSiteLabel }: SiteSelectorProps) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const sites = await getSites();
        const formatted = sites.map((s) => ({
          label: s.name,
          value: s.name,
        }));
        setOptions(formatted);
      } catch (error) {
        console.error('Failed to fetch sites:', error);
      }
    };

    fetchSites();
  }, []);

  return (
    <DarkPicker
      name="site"
      label="Site"
      value={value}
      options={options}
      onSelect={(item) => {
        onChange(item.value);
        setSiteLabel?.(item.label);
      }}
    />
  );
}