import { useContext } from 'react';
import { AuthContext } from '../contexts/used-auth/jwt-context';

export const useAuth = () => useContext(AuthContext);
