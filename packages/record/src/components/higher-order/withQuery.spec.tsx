import React from 'react';
import { setupServer } from 'msw/node';
import { render, waitFor } from '@testing-library/react';
import { graphql } from 'msw';
import { DateTime } from 'luxon';
import { withQuery } from './withQuery';
import { withProviders } from './withProviders';

interface UserExample {
  name: string;
}

interface ExampleProps {
  user: UserExample;
  className: string;
}

const mockNavigate = jest.fn();
jest.mock('@reach/router', () => ({
  useNavigate: () => mockNavigate,
}));
const token = { u: 1, t: Date.now(), k: '1234567890', e: DateTime.now().plus({ hour: 1 }).toMillis() };
const refreshToken = btoa(JSON.stringify(token));
const server = setupServer(
  graphql.query<{ user: UserExample }>(
    'GetUser',
    (req, res, { data, set }) => res(
      set('X-Refresh-Token', refreshToken),
      data({ user: { name: 'John' } }),
    ),
  ),
);

const Example = (props: ExampleProps) => (<div className={props.className}>{props.user.name}</div>);

describe('withQuery()', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  beforeEach(() => {
    server.resetHandlers();
    mockNavigate.mockReset();
    localStorage.clear();
    localStorage.setItem('jwt', JSON.stringify(token));
  });
  afterAll(() => server.close());

  it('fills out props', async () => {
    const Element = withQuery(
      (gql) => gql<{ user: UserExample }>`
        query GetUser {
          user {
            name
          }
        }
      `,
      Example,
    );
    const Wrapped = withProviders(Element);
    const { queryByText, getByText, asFragment } = render(<Wrapped className="text-blue-400" />);
    expect(queryByText('John')).toBeNull();
    await waitFor(() => {
      expect(getByText('John')).toBeInTheDocument();
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
