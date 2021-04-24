import React from 'react';
import { setupServer } from 'msw/node';
import { render, waitFor } from '@testing-library/react';
import { graphql } from 'msw';
import { withQuery } from './withQuery';
import { withProviders } from './withProviders';

interface UserExample {
  name: string;
}

interface ExampleProps {
  user: UserExample;
}

const mockNavigate = jest.fn();
jest.mock('@reach/router', () => ({
  useNavigate: () => mockNavigate,
}));
const server = setupServer(
  graphql.query<ExampleProps>(
    'GetUser',
    (req, res, ctx) => res(ctx.data({ user: { name: 'John' } })),
  ),
);

const Example = (props: ExampleProps) => (<div>{props.user.name}</div>);

describe('withQuery()', () => {
  beforeAll(() => server.listen());
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
    const { queryByText, getByText } = render(<div><Wrapped /></div>);
    expect(queryByText('John')).toBeNull();
    await waitFor(() => {
      expect(getByText('John')).toBeInTheDocument();
    });
  });
});
