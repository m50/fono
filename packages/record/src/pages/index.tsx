import React, { useCallback, useEffect, useState } from 'react';
import type { RouteComponentProps } from '@reach/router';
import Card from 'components/card';
import Button from 'components/input/button';
import useApi from 'hooks/useApi';
import { Markdown } from 'components/markdown/Markdown';
import { cl } from 'lib/helpers';

export default function Home(props: RouteComponentProps) {
  const { api, gql } = useApi();
  const [welcomeData, setWelcomeData] = useState<Record<string, any>>({});

  const requestUser = useCallback(() => {
    gql`
      # nocache
      query GetUser {
        user(id: 1) {
          username
          email
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
    <div className={cl`
        flex justify-around items-center flex-col h-full
        mt-2 lg:my-auto space-y-2 lg:space-y-20 mx-2
        lg:w-1/2 w-full md:mx-0 sm:w-2/3 md:w-1/2
      `}
    >
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
          <Button onClick={() => api('GET', '/logout')}>
            Logout
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
