import React, { useEffect, useMemo, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import Card from 'components/card';
import { MenuLink } from 'components/styled/menu-link';
import { UserIcon, MusicNoteIcon, AdjustmentsIcon, ChipIcon } from '@heroicons/react/solid';
import useApi from 'hooks/useApi';
import { User } from 'types/user';

interface UserInfo {
  user: User;
}

export const ConfigMain: React.FC<RouteComponentProps> = () => {
  const { gql, userId } = useApi();
  const [user, setUser] = useState<UserInfo['user'] | undefined>();
  const userInfo = useMemo(() => {
    let userInfo = user?.username;
    if (user?.username !== user?.email) {
      userInfo += ` (${user?.email})`;
    }
    return userInfo;
  }, [user])

  useEffect(() => {
    if (userId === undefined) {
      return;
    }
    gql<UserInfo>`
      query LoggedInUser {
        user(id: ${userId.toString()}) {
          id
          email
          username
          createdAt
          updatedAt
        }
      }
    `.then((res) => setUser(res.data.user));
  }, [userId]);

  return (
    <div className="w-full px-2">
      <Card>
        <Card.Body className="space-y-4">
          <MenuLink to="user" state={{ user }}>
            <UserIcon className="h-10 fill-current inline pr-2" />
            <div className="flex flex-col">
              <span className="text-lg">Account</span>
              <span className="text-xs text-gray-300">{userInfo}</span>
            </div>
          </MenuLink>
          <MenuLink to="system">
            <ChipIcon className="h-10 fill-current inline pr-2" />
            System
          </MenuLink>
          <MenuLink to="music">
            <MusicNoteIcon className="h-10 fill-current inline pr-2" />
            Music Sources
          </MenuLink>
          <MenuLink to="preferences">
            <AdjustmentsIcon className="h-10 fill-current inline pr-2" />
            General Preferences
          </MenuLink>
        </Card.Body>
      </Card>
    </div>
  );
};
