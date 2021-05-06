import { useNavigate } from '@reach/router';
import { useEffect } from 'react';
import { useToken } from './useToken';

export const useAuthToken = () => {
  const [token, setToken] = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return () => (null);
    }

    const timer = setTimeout(() => {
      setToken(undefined);
    }, token.e - Date.now());

    if (token.e < Date.now()) {
      setToken(undefined);
    }

    return () => clearTimeout(timer);
  }, [token]);

  return token;
};
