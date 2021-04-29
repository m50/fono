import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps, WindowLocation } from '@reach/router';
import Card from 'components/card';
import { User } from 'types/user';
import useApi from 'hooks/useApi';
import Button from 'components/input/button';
import { SaveIcon, LogoutIcon, UserIcon } from '@heroicons/react/solid';
import TextInput from 'components/input/text';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface Props extends RouteComponentProps {
  location?: WindowLocation<{
    user: User;
    updatePassword?: boolean
  }>;
}

interface FormData {
  email?: string;
  username?: string;
  currentPassword?: string;
  password?: string;
  passwordConfirmation?: string;
}

const formSchema = yup.object({
  username: yup.string().required(),
  email: yup.string().required()
    .when('username', (username: string, schema: yup.StringSchema) => username === 'admin' ? schema : schema.email()),
  password: yup.string()
    .min(8)
    .matches(/^((?!(.)\2{1,}).)*$/, 'password must not have repeating characters.')
    .matches(/[A-Z]/, 'password must contain an upper-case letter.')
    .matches(/[0-9]/, 'password must contain a number.')
    .matches(/[!$#%@^\\\/)(\.\[\]<>;:]/, 'password must contain a symbol ( ! $ # % @ ^ \\ / ( ) . [ ] < > ; : ).')
    .matches(/[a-z]/, 'password must contain a lower-case letter.'),
  passwordConfirmation: yup.string().min(8)
    .when('password', (password: string, schema: yup.StringSchema) => password.length > 0 ? schema.required() : schema)
    .when('password', (password: string, schema: yup.StringSchema) => schema.equals([password], 'Passwords must match!')),
  currentPassword: yup.string()
    .when('password', (password: string, schema: yup.StringSchema) => password.length > 0 ? schema.required() : schema)
    .when('password', (password: string, schema: yup.StringSchema) => schema.notOneOf(
      [password],
      'New password and current password cannot match. Did you mistype your current password?'
    )),
});

export const ConfigUser: React.FC<Props> = ({ location }) => {
  const state = location?.state ?? undefined
  const { api, gql, userId } = useApi();
  const [user, setUser] = useState<User | undefined>(state?.user ?? undefined);
  const { handleSubmit, register, formState: { errors, } } = useForm<FormData>({
    resolver: yupResolver(formSchema),
  });

  useEffect(() => {
    if (!userId || user) {
      return;
    }
    gql<{ user: User }>`
      query LoggedInUser {
        user(id: ${userId.toString()}) {
          id
          email
          username
          createdAt
          updatedAt
        }
      }
    `.then((res) => setUser(res.data?.user));
  }, [userId]);

  const onSubmit = useCallback((data: FormData) => {
    console.log(data);
  }, [handleSubmit]);

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
        <Card.Footer className="flex justify-between">
          <Button icon={LogoutIcon} onClick={() => api('GET', '/logout')}>Logout</Button>
          <Button icon={SaveIcon} primary type="submit">Save</Button>
        </Card.Footer>
      </Card>
    </div>
  );
};
