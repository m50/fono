import { ApolloQueryResult } from "@apollo/client";
import { GQLAPI } from "hooks/useApi/useGraphql";
import { User } from "types/user";

export const getUser = (gql: GQLAPI, userId: number): Promise<ApolloQueryResult<{ user: User }>> => gql`
  query LoggedInUser {
    user(id: ${userId.toString()}) {
      id
      email
      username
      createdAt
      updatedAt
    }
  }
`
