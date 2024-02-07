import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { graphql } from "~/gql";

const me = graphql(`
  query AllProjects {
    projects {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`);

export async function getUser(
  client: ApolloClient<NormalizedCacheObject>
) {
  const result = await client.query({ query: me });
  return result.data.projects.edges.map((edge) => edge.node);
}


