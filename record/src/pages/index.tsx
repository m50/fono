import React, { useEffect, useState } from 'react';
import type { RouteComponentProps } from '@reach/router';
import useSocket from 'hooks/useSocket';

export default function Home(props: RouteComponentProps) {
  const ws = useSocket();
  const [welcomeData, setWelcomeData] = useState<Record<string, any>>({});
  useEffect(() => {
    ws.on('welcome', (data: Record<string, any>) => setWelcomeData(data));
    ws.send('test', { value: 'hi!' });
  }, [ws]);
  return (
    <div className="bg-gray-300">
      hello {props.path}<br />
      <pre>{JSON.stringify(welcomeData, null, 2)}</pre>
    </div>
  );
}
