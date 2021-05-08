import React, { useCallback, useEffect, useState } from 'react';
import type { RouteComponentProps } from '@reach/router';
import Card from 'components/card';
import Button from 'components/input/button';
import useApi from 'hooks/useApi';
import { Markdown } from 'components/markdown/Markdown';
import { RefreshIcon } from '@heroicons/react/solid';
import { User } from 'types/user';
import { useAddToast } from 'components/toasts';

export default function Home(props: RouteComponentProps) {
  const { gql, userId } = useApi();
  const [welcomeData, setWelcomeData] = useState<User | {}>({});
  const addToast = useAddToast();

  const requestUser = useCallback(async () => {
    if (!userId) return;
    const { data } = await gql<{ user: User }>`
      query LoggedInUser {
        user(id: ${userId}) {
          id
          email
          username
          createdAt
          updatedAt
        }
      }
    `;
    setWelcomeData(data.user);
  }, []);

  const createToast = useCallback(() => {
    const type = ['info', 'success', 'error', 'warning'][Math.floor(Math.random() * 4)] as "info" | "success" | "error" | "warning";
    addToast({
      type,
      title: 'test',
      ttl: Math.random() * 10,
    })
  }, []);

  useEffect(() => {
    requestUser();
  }, []);

  return (
    <div className="w-full px-2">
      <Card className="w-full">
        <Card.Title>Home Page</Card.Title>
        <Card.Body collapsable title="Some debug data">
          <Button iconLeft
            className="absolute right-0 mr-6 mt-1"
            icon={RefreshIcon}
            onClick={requestUser}
          />
          <Markdown>{`
~~~json
${JSON.stringify(welcomeData, null, 2)}
~~~
          `}
          </Markdown>
        </Card.Body>
        <Card.Body><Button onClick={createToast}>Create Toast</Button></Card.Body>
      </Card>
    </div>
  );
}
