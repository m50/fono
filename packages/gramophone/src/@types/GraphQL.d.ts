declare module '*.gql' {
  const value: import('graphql').DocumentNode;
  export const raw: string;
  export default value;
}
declare module '*.graphql' {
  const value: import('graphql').DocumentNode;
  export const raw: string;
  export default value;
}
