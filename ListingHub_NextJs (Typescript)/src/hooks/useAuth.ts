import { useAuth as useAuthContext } from '@/contexts/AuthContext';

/**
 * Extended useAuth hook with 'user' alias for userData
 */
export const useAuth = () => {
  const context = useAuthContext();
  return {
    ...context,
    user: context.userData, // Alias userData as user for convenience
  };
};

