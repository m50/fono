import React from 'react';
import { Link, RouteComponentProps } from '@reach/router';
import Card from 'components/card';
import { ChevronRightIcon as RightArrow } from '@heroicons/react/solid';

interface Props extends RouteComponentProps {

}

export const ConfigMain = (props: Props) => {
  return (
    <div className="w-full">
      <Card>
        <Card.Body className="border-0 border-b border-gray-400 border-opacity-40">
          <Link to="something" className="justify-between flex w-full">
            <span>Something!</span>
            <RightArrow className="fill-current h-6" />
          </Link>
        </Card.Body>
      </Card>
    </div>
  );
};
