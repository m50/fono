import React, { useState } from 'react';
import { RouteComponentProps, useNavigate } from '@reach/router';
import useApi from 'hooks/useApi';
import { useForm } from 'react-hook-form';
import Card from 'components/card';
import TextInput from 'components/input/text';
import { stringify } from 'gray-matter';
import { DateTime } from 'luxon';

export interface User {
  id: number;
  email: string;
  username: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}

interface FormData {
  username: string;
  password: string;
}

interface ApiResponse {
  message: string;
  user: User;
}

// eslint-disable-next-line
const Login = (props: RouteComponentProps) => {
  const navigate = useNavigate();
  const { api } = useApi();
  const [authMessage, setAuthMessage] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const onSubmit = (data: FormData) => {
    api<ApiResponse, FormData>('POST', '/login', data)
      .then((response) => {
        setAuthMessage(response.message);
        if (response.user) {
          navigate('/');
        }
      });
  };

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
        </Card.Body>
        <Card.Footer>
          <input type="submit" className="text-black" />
          {authMessage}
        </Card.Footer>
      </Card>
    </form>
  );
};

export default Login;
