import { useUser } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';

export const AuthGuard = ({ children }) => {
  const { isLoaded, user } = useUser();

  if (!isLoaded) return null;
  if (!user) return <Redirect href="/login" />;

  return children;
};
