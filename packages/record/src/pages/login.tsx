import React, { useCallback, useState } from 'react';
import { RouteComponentProps, useNavigate } from '@reach/router';
import useApi from 'hooks/useApi';
import { useForm } from 'react-hook-form';
import Card from 'components/card';
import TextInput from 'components/input/text';
import Checkbox from 'components/input/checkbox';
import Button from 'components/input/button';
import { LoginIcon } from '@heroicons/react/solid';
import { User } from 'types/user';
import { isSuccessResponse } from 'hooks/useApi/useRest';
import { useAddToast } from 'components/toasts';

interface FormData {
  username: string;
  password: string;
  keepLoggedIn?: boolean;
}

interface ApiResponse {
  message: string;
  user: User;
}

const Login: React.FC<RouteComponentProps> = () => {
  const navigate = useNavigate();
  const { api } = useApi();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const addToast = useAddToast();
  const onSubmit = useCallback(async (data: FormData) => {
    const response = await api<ApiResponse, FormData>('POST', '/login', data);

    if (isSuccessResponse(response)) {
      addToast({ title: 'Success!', body: response.message, type: 'success' });
      if (data.password === 'admin' && response.user.username === 'admin') {
        return navigate('/settings/user', { state: { updatePassword: true, user: response.user } });
      }
      return navigate('/');
    }

    addToast({ title: 'Login failed!', body: response.message, type: 'error' });
  }, []);

  return (
    <form className="flex-grow flex justify-center items-center" onSubmit={handleSubmit(onSubmit)}>
      <Card className="lg:w-1/4 w-full mx-2 md:mx-0 sm:w-2/3 md:w-1/2">
        <Card.Title>Login</Card.Title>
        <Card.Body>
          <TextInput title="Username"
            errors={errors.username}
            register={register('username', { required: true })}
          />
          <TextInput title="Password" type="password"
            errors={errors.password}
            register={register('password', { required: true })}
          />
          <Checkbox title="Keep me logged in"
            register={register('keepLoggedIn', { required: false })}
            errors={errors.keepLoggedIn}
          />
        </Card.Body>
        <Card.Footer className="flex justify-around">
          <Button icon={LoginIcon} primary type="submit">Login</Button>
        </Card.Footer>
      </Card>
    </form>
  );
};

export default Login;
