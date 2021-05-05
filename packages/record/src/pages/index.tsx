import React, { useCallback, useEffect, useState } from 'react';
import type { RouteComponentProps } from '@reach/router';
import Card from 'components/card';
import Button from 'components/input/button';
import useApi from 'hooks/useApi';
import { Markdown } from 'components/markdown/Markdown';
import { PageWrapper } from 'components/styled/page-wrapper';
import { PageHeader } from 'components/styled/page-header';
import { LogoutIcon, RefreshIcon } from '@heroicons/react/solid';
import { User } from 'types/user';

export default function Home(props: RouteComponentProps) {
  const { api, gql, userId } = useApi();
  const [welcomeData, setWelcomeData] = useState<User | {}>({});

  const requestUser = useCallback(() => {
    if (!userId) return;
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
    `.then((res) => setWelcomeData(res.data.user));
  }, []);

  useEffect(() => {
    requestUser();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <PageHeader path={props.uri as string} title="Home" />
      <PageWrapper className="w-full px-2 space-y-2">
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
            `}</Markdown>
          </Card.Body>
          <Card.Footer className="flex justify-end">
            <Button icon={LogoutIcon} onClick={() => api('GET', '/logout')}>
              Logout
            </Button>
          </Card.Footer>
        </Card>
      </PageWrapper>
    </div>
  );
}
