import React, { useCallback, useEffect, useRef, useState } from 'react';
import Card from 'components/card';
import { User } from 'types/user';
import useApi from 'hooks/useApi';
import Button from 'components/input/button';
import { SaveIcon, LogoutIcon, UserIcon } from '@heroicons/react/solid';
import TextInput from 'components/input/text';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './utils/schema';
import { Props, FormData } from './utils/types';
import { getUser } from './utils/queries';
import { isCustomValidationResponse, isSchemaValidationResponse, isSuccessResponse } from 'hooks/useApi/useRest';

export const ConfigUser: React.FC<Props> = ({ location }) => {
  const state = location?.state ?? undefined
  const { api, gql, userId } = useApi();
  const [user, setUser] = useState<User | undefined>(state?.user);
  const [success, setSuccess] = useState(false);
  const [status, setStatus] = useState('');
  const { handleSubmit, register, setError, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!userId || user) return;
    getUser(gql, userId).then((res) => setUser(res.data?.user));
  }, [userId]);

  const onSubmit = useCallback(async (data: FormData) => {
    console.log(data);
    type Res = { message: string, user: User };
    const res = await api<Res>('PATCH', '/user', data);
    if (isSuccessResponse<Res>(res)) {
      setUser(res.user);
      setSuccess(true);
      setStatus(res.message);
      setTimeout(() => {
        setStatus('');
      }, 5000);
    }
    if (isSchemaValidationResponse(res)) {
      setSuccess(false);
      setStatus(res.message.split(/, /).join('\n'));
    }
    console.log(res);
    if (isCustomValidationResponse(res)) {
      setSuccess(false);
      Object.keys(res.errors.body).forEach((k) => {
        setError(k as keyof FormData, {
          type: 'api',
          message: res.errors.body[k],
        })
      });
    }
  }, [handleSubmit, api]);

  return (
    <div className="w-full px-2 space-y-2">
      <Card form={{ onSubmit: handleSubmit(onSubmit) }}>
        <Card.Title>Account</Card.Title>
        <Card.Body title="identification" collapsable collapsed={state?.updatePassword}>
          <div className="flex justify-start items-center space-x-5">
            <div className="rounded-full w-24 h-24 bg-gray-400 bg-opacity-30 flex justify-center items-center">
              <UserIcon className="fill-current h-16" />
            </div>
            <div>
              <TextInput title="Email" type={user?.email === 'admin' ? 'text' : 'email'} value={user?.email}
                register={register('email', { required: true })} errors={errors.email}
              />
              <TextInput title="Username" value={user?.username}
                register={register('username', { required: true })} errors={errors.username}
              />
            </div>
          </div>
        </Card.Body>
        <Card.Body title="Change Password" collapsable>
          {state?.updatePassword && (<div className="text-red-400 text-3xl flex justify-center">
            You should change your password!
          </div>)}
          <div className="flex space-x-12">
            <TextInput title="New Password" className="w-full"
              register={register('password')}
              type="password" errors={errors.password}
            />
            <TextInput title="Confirm Password" className="w-full"
              register={register('passwordConfirmation')}
              type="password" errors={errors.passwordConfirmation}
            />
          </div>
          <div className="w-1/2 pr-5">
            <TextInput title="Current Password"
              register={register('currentPassword')}
              type="password" errors={errors.currentPassword}
            />
          </div>
        </Card.Body>
        <Card.Body className="flex justify-center items-center w-full">
          <pre>
            <div className={`text-sm ${success ? 'text-green-400' : 'text-red-400'}`}>{status}</div>
          </pre>
        </Card.Body>
        <Card.Footer className="flex justify-between">
          <Button icon={LogoutIcon} onClick={() => api('GET', '/logout')}>Logout</Button>
          <Button icon={SaveIcon} primary type="submit">Save</Button>
        </Card.Footer>
      </Card>
    </div>
  );
};
