import React, { useEffect } from 'react';
import type { RouteComponentProps } from '@reach/router';
import useSocket from 'hooks/useSocket';

export default function Home(props: RouteComponentProps) {
  const ws = useSocket();
  useEffect(() => {
    ws.on('welcome', (data) => console.log(data));
    ws.send('test', { value: 'hi!' });
  }, [ws]);
  return (
    <div className="bg-gray-300">
      hello {props.path}
    </div>
  );
}
