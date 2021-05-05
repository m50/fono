import useApi from "hooks/useApi";
import { isCustomValidationResponse, isSchemaValidationResponse, isSuccessResponse } from "hooks/useApi/useRest";
import { useCallback, useEffect, useState } from "react";
import type { Path, UseFormSetError } from "react-hook-form";
import { User } from "types/user";
import { getUser } from "./queries";

export const useFormStatus = <T extends Record<string, any>>(setError: UseFormSetError<T>, stateUser?: User) => {
  const { api, gql, userId } = useApi();
  const [user, setUser] = useState<User | undefined>(stateUser);
  const [success, setSuccess] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!userId || user) return;
    getUser(gql, userId).then((res) => setUser(res.data?.user));
  }, [userId]);

  const onSubmit = useCallback(async (data: FormData) => {
    type Res = { message: string, user: User };
    const res = await api<Res>('PATCH', '/user', data);
    setStatus(res.message.split(/, /).join('\n'));
    if (isSuccessResponse<Res>(res)) {
      setUser(res.user);
      setSuccess(true);
      setTimeout(() => {
        setStatus('');
      }, 5000);
    }
    if (isSchemaValidationResponse(res)) {
      setSuccess(false);
    }
    if (isCustomValidationResponse(res)) {
      setSuccess(false);
      Object.keys(res.errors.body).forEach((k) => setError(k as Path<T>, {
        type: 'api',
        message: res.errors.body[k],
      }));
    }
  }, [api]);

  return {
    user,
    success,
    status,
    onSubmit,
  }
};
