import useApi from 'hooks/useApi';
import { isCustomValidationResponse, isSchemaValidationResponse, isSuccessResponse } from 'hooks/useApi/useRest';
import { useEffect, useState } from 'react';
import type { Path, UseFormSetError } from 'react-hook-form';
import { User } from 'types/user';
import { useAddToast } from 'components/toasts';
import { getUser } from './queries';

export const useFormStatus = <T extends Record<string, any>>(setError: UseFormSetError<T>, stateUser?: User) => {
  const { api, gql, userId } = useApi();
  const addToast = useAddToast();
  const [user, setUser] = useState<User | undefined>(stateUser);

  useEffect(() => {
    if (!userId || user) return;
    getUser(gql, userId).then((res) => setUser(res.data?.user));
  }, [userId]);

  const onSubmit = async (data: FormData) => {
    type Res = { message: string, user: User };
    const res = await api<Res>('PATCH', '/user', data);
    const title = res.message.split(/, /).join('\n');
    if (isSuccessResponse<Res>(res)) {
      setUser(res.user);
      addToast({ title, type: 'success' });
    }
    if (isSchemaValidationResponse(res)) {
      addToast({ title, type: 'error' });
    }
    if (isCustomValidationResponse(res)) {
      addToast({ title, type: 'error' });
      Object.keys(res.errors.body).forEach((k) => setError(k as Path<T>, {
        type: 'api',
        message: res.errors.body[k],
      }));
    }
  };

  return { user, onSubmit };
};
