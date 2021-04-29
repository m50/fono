import { setupServer } from 'msw/node';
import { renderHook, act } from '@testing-library/react-hooks';
import { rest, graphql } from 'msw';
import useApi from '.';
import { DateTime } from 'luxon';

const mockNavigate = jest.fn();
jest.mock('@reach/router', () => ({
  useNavigate: () => mockNavigate,
}));
jest.mock('@apollo/client/react', () => ({
  useApolloClient: () => jest.fn(),
}));

interface Response {
  message: string;
}

interface GetUserQueryResponse {
  user: {
    name: string;
  };
}

const server = setupServer(
  rest.get('/g/ping', (req, res, { json }) => res(json<Response>({ message: 'pong' }))),
  rest.post('/g/login', (req, res, { set, json }) => res(
    set('X-Refresh-Token', btoa(JSON.stringify(
      { u: 1, t: Date.now(), k: '1234567890', e: DateTime.now().plus({ hour: 1 }).toMillis() }
    ))),
    json<Response>({ message: 'Successfully Authenticated' }),
  )),
  rest.post('/g/login2', (req, res, { set, json }) => res(
    set('X-Refresh-Token', btoa(JSON.stringify(
      { u: 1, t: Date.now(), k: '1234567890', e: DateTime.now().plus({ hour: 20 * 24 }).toMillis() }
    ))),
    json<Response>({ message: 'Successfully Authenticated' }),
  )),
  rest.post('/g/logout', (req, res, { json, status }) => res(
    status(401),
    json<Response>({ message: 'Logged out' }),
  )),
  graphql.query<GetUserQueryResponse>(
    'GetUser',
    (req, res, ctx) => res(ctx.data({ user: { name: 'John' } })),
  ),
);

describe('useApi()', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => {
    server.resetHandlers();
    mockNavigate.mockReset();
    localStorage.clear();
  });
  afterAll(() => server.close());

  it('can make request', async () => {
    const { result } = renderHook(() => useApi());
    const { api } = result.current;
    await act(async () => {
      const response = await api<Response>('GET', '/ping');
      expect(response.message).toBe('pong');
    });
  });

  it('allows log in', async () => {
    const { result } = renderHook(() => useApi());
    const { api } = result.current;
    expect(result.current.userId).toBeUndefined();

    await act(async () => {
      const response = await api<Response>('POST', '/login');
      expect(response.message).toBe('Successfully Authenticated');
    });

    expect(result.current.userId).not.toBeUndefined();
    expect(result.current.userId).toBe(1);
  });

  it('logs you out after 1 hour', async () => {
    jest.useFakeTimers();
    expect(setTimeout).not.toHaveBeenCalled();
    const oneHour = 1 /* h */ * 60 /* m */ * 60 /* s */ * 1000; /* ms */
    const { result } = renderHook(() => useApi());
    expect(setTimeout).toHaveBeenCalledTimes(0);

    await act(async () => {
      const response = await result.current.api<Response>('POST', '/login');
      expect(response.message).toBe('Successfully Authenticated');
    });
    expect(setTimeout).toHaveBeenCalledTimes(2);
    act(() => {
      jest.advanceTimersByTime(oneHour);
    });

    expect(mockNavigate).toHaveBeenCalled();
    expect(result.current.userId).toBeUndefined();
  });

  it('logs you out after specified time', async () => {
    jest.useFakeTimers();
    expect(setTimeout).not.toHaveBeenCalled();
    const twentyDays = 20 /* d */ * 24 /* h */ * 60 /* m */ * 60 /* s */ * 1000; /* ms */
    const oneDay = 24 /* h */ * 60 /* m */ * 60 /* s */ * 1000; /* ms */
    const { result } = renderHook(() => useApi());
    expect(setTimeout).toHaveBeenCalledTimes(0);

    await act(async () => {
      const response = await result.current.api<Response>('POST', '/login2');
      expect(response.message).toBe('Successfully Authenticated');
    });
    expect(setTimeout).toHaveBeenCalledTimes(1);
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(setTimeout).toHaveBeenCalledTimes(1);
    act(() => {
      jest.advanceTimersByTime(oneDay);
    });
    console.log(result.current.token);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    act(() => {
      jest.advanceTimersByTime(twentyDays - oneDay);
    });

    expect(mockNavigate).toHaveBeenCalled();
    expect(result.current.userId).toBeUndefined();
  });

  it('logs you out if 401 is not returned', async () => {
    const { result } = renderHook(() => useApi());
    expect(mockNavigate).toHaveBeenCalledTimes(1);

    await act(async () => {
      const response = await result.current.api<Response>('POST', '/login');
      expect(response.message).toBe('Successfully Authenticated');
    });
    expect(mockNavigate).toHaveBeenCalledTimes(1);

    await act(async () => {
      const response = await result.current.api<Response>('GET', '/ping');
      expect(response.message).toBe('pong');
    });
    expect(mockNavigate).toHaveBeenCalledTimes(1);

    await act(async () => {
      const response = await result.current.api<Response>('POST', '/logout');
      expect(response.message).toBe('Logged out');
    });
    expect(mockNavigate).toHaveBeenCalledTimes(2);
  });
});
