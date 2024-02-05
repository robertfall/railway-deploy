import { ApolloClient, InMemoryCache } from "@apollo/client";

import { graphql } from "../gql";

const GRAPHQL_SERVER_URL = "https://backboard.railway.app/graphql/v2";
const API_TOKEN = process.env.API_TOKEN;

const client = new ApolloClient({
  uri: GRAPHQL_SERVER_URL,
  cache: new InMemoryCache({
    addTypename: false,
  }),
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

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

export async function getAllProjects() {
  const result = await client.query({ query: allProjects });
  return result.data.projects.edges;
}

const createService = graphql(`
  mutation CreateService(
    $projectId: String!
    $name: String!
    $source: String!
    $variables: ServiceVariables!
  ) {
    serviceCreate(
      input: {
        projectId: $projectId
        name: $name
        source: { image: $source }
        variables: $variables
      }
    ) {
      id
    }
  }
`);

export async function createNewService(
  projectId: string,
  name: string,
  source: string,
  variables: Record<string, string>
) {
  return await client.mutate({
    mutation: createService,
    variables: { projectId, name, source, variables },
  });
}

export async function deleteService(id: string) {
  return await client.mutate({
    mutation: graphql(`
      mutation DeleteService($id: String!) {
        serviceDelete(id: $id)
      }
    `),
    variables: { id },
  });
}

export async function servicesForProject(projectId: string) {
  const result = await client.query({
    query: graphql(`
      query ServicesForProject($projectId: String!) {
        project(id: $projectId) {
          services {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    `),
    variables: { projectId },
  });

  return result.data.project.services.edges;
}
