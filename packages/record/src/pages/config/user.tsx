import React, { useEffect, useState } from 'react';
import { RouteComponentProps, WindowLocation } from '@reach/router';
import Card from 'components/card';
import { User } from 'types/user';
import useApi from 'hooks/useApi';
import Button from 'components/input/button';
import { SaveIcon, LogoutIcon } from '@heroicons/react/solid';

interface Props extends RouteComponentProps {
  location?: WindowLocation<{
    user: User;
    updatePassword?: boolean
  }>;
}

export const ConfigUser: React.FC<Props> = ({ location }) => {
  const state = location?.state ?? undefined
  const { api, gql, userId } = useApi();
  const [user, setUser] = useState<User | undefined>(state?.user ?? undefined);

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

  return (
    <div className="w-full px-2 space-y-2">
      <Card form={{ onSubmit: (e) => { e.preventDefault(); console.log('submitted') } }}>
        <Card.Title>Account</Card.Title>
        <Card.Body title="identification" collapsable collapsed={state?.updatePassword}>
          <pre>{user?.email}</pre>
          <pre>{user?.username}</pre>
        </Card.Body>
        <Card.Footer className="flex justify-between">
          <Button icon={LogoutIcon} onClick={() => api('GET', '/logout')}>Logout</Button>
          <Button icon={SaveIcon} primary type="submit">Save</Button>
        </Card.Footer>
      </Card>
    </div>
  );
};
