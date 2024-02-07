import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { graphql } from "../gql";

const allProjects = graphql(`
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

export async function getAllProjects(
  client: ApolloClient<NormalizedCacheObject>
) {
  const result = await client.query({ query: allProjects });
  return result.data.projects.edges.map((edge) => edge.node);
}
