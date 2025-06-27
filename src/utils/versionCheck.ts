import Constants from 'expo-constants';
import * as Updates from 'expo-updates';

export const getCurrentVersion = () => {
  const appConfig = Constants.expoConfig;
  return {
    version: appConfig?.version || '1.0.0',
    buildNumber: String(appConfig?.ios?.buildNumber || appConfig?.android?.versionCode || '1')
  };
};

export const checkForUpdates = async (): Promise<boolean> => {
  try {
    const update = await Updates.checkForUpdateAsync();
    return update.isAvailable;
  } catch (error) {
    console.error('Error checking for updates:', error);
    return false;
  }
};

export const downloadLatestAPK = async (): Promise<void> => {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (!update.isAvailable) {
      throw new Error('No update available');
    }

    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
  } catch (error) {
    console.error('Error downloading update:', error);
    throw error;
  }
}; 