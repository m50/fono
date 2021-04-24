import React, { useEffect, useState } from 'react';
import type { RouteComponentProps } from '@reach/router';
import useSocket from 'hooks/useSocket';
import Card from 'components/card';
import Button from 'components/input/button';
import useApi from 'hooks/useApi';
import { Markdown } from 'components/markdown/Markdown';
import { cl } from 'lib/helpers';

export default function Home(props: RouteComponentProps) {
  const ws = useSocket();
  const { api } = useApi();
  const [welcomeData, setWelcomeData] = useState<Record<string, any>>({});

  useEffect(() => {
    const disconnect = ws.on('welcome', (data: Record<string, any>) => setWelcomeData(data));
    ws.send('test', { value: 'hi!' });

    return () => disconnect();
  }, [ws]);

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
          <Markdown>{`_hello \`${props.path}\` ${welcomeData?.message}_`}</Markdown>
        </Card.Body>
      </Card>
      <Card className="w-full">
        <Card.Title>Home Page</Card.Title>
        <Card.Body>
          <Markdown>{`~~hello \`${props.path}\` ${welcomeData?.message}~~`}</Markdown>
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
