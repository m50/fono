import React, { useCallback, useEffect, useState } from 'react';
import type { RouteComponentProps } from '@reach/router';
import Card from 'components/card';
import Button from 'components/input/button';
import useApi from 'hooks/useApi';
import { Markdown } from 'components/markdown/Markdown';
import { PageWrapper } from 'components/styled/page-wrapper';
import { PageHeader } from 'components/styled/page-header';
import { LogoutIcon } from '@heroicons/react/solid';

export default function Home(props: RouteComponentProps) {
  const { api, gql } = useApi();
  const [welcomeData, setWelcomeData] = useState<Record<string, any>>({});

  const requestUser = useCallback(() => {
    gql`
      query GetUser {
        user(id: 1) {
          username
          email
          createdAt
          updatedAt
        }
      }
    `.then((res) => {
      setWelcomeData(res.data);
    });
  }, []);

  useEffect(() => {
    requestUser();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <PageHeader path={props.uri as string} title="Home" />
      <PageWrapper>
        <Card className="w-full">
          <Card.Title>Home Page</Card.Title>
          <Card.Body collapsable title="Some debug data">
            <Markdown>{`
~~~json
${JSON.stringify(welcomeData, null, 2)}
~~~
            `}</Markdown>
            <Button onClick={requestUser} className="mt-5">
              Refresh
            </Button>
          </Card.Body>
          <Card.Footer>
            <Button icon={<LogoutIcon className="fill-current h-4 pl-2 inline" />} onClick={() => api('GET', '/logout')}>
              Logout
            </Button>
          </Card.Footer>
        </Card>
      </PageWrapper>
    </div>
  );
}
