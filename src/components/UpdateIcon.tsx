import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { checkForUpdates, downloadLatestAPK } from '@/utils/versionCheck';
import { useTheme } from '@/context/ThemeContext';

export default function UpdateIcon() {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    checkForUpdate();
  }, []);

  const checkForUpdate = async () => {
    const updateAvailable = await checkForUpdates();
    setHasUpdate(updateAvailable);
  };

  const handleDownload = async () => {
    if (!hasUpdate || isDownloading) return;

    try {
      setIsDownloading(true);
      await downloadLatestAPK();
      Alert.alert(
        'Update Complete',
        'The app will now restart to apply the update.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Download failed:', error);
      Alert.alert(
        'Update Failed',
        'There was an error downloading the update. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsDownloading(false);
    }
  };

  if (!hasUpdate) return null;

  return (
    <TouchableOpacity 
      onPress={handleDownload}
      disabled={isDownloading}
      style={{ marginRight: 15 }}
    >
      {isDownloading ? (
        <ActivityIndicator 
          size="small" 
          color={theme === 'light' ? '#1a1a1a' : '#ffffff'} 
        />
      ) : (
        <Ionicons 
          name="refresh-circle-outline" 
          size={24} 
          color={theme === 'light' ? '#1a1a1a' : '#ffffff'} 
        />
      )}
    </TouchableOpacity>
  );
} 