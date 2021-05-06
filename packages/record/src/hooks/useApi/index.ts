import { useGraphql } from './useGraphql';
import { useRest } from './useRest';
import { useAuthToken } from './useAuthToken';

const useApi = () => {
  const token = useAuthToken();
  const gql = useGraphql();
  const api = useRest();

  return { api, gql, userId: token?.u, token };
};

export default useApi;
