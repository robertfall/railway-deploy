import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { graphql } from "~/gql";

const createServiceMutation = graphql(`
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
  client: ApolloClient<NormalizedCacheObject>,
  projectId: string,
  name: string,
  source: string,
  variables: Record<string, string>
) {
  return await client.mutate({
    mutation: createServiceMutation,
    variables: { projectId, name, source, variables },
  });
}

const deleteServiceMutation = graphql(`
  mutation DeleteService($id: String!) {
    serviceDelete(id: $id)
  }
`);

export async function deleteService(
  client: ApolloClient<NormalizedCacheObject>,
  id: string
) {
  return await client.mutate({
    mutation: deleteServiceMutation,
    variables: { id },
  });
}

const servicesForProjectQuery = graphql(`
  query ServicesForProject($projectId: String!) {
    project(id: $projectId) {
      services {
        edges {
          node {
            id
            name
            createdAt
            deployments(last: 5) {
              edges {
                node {
                  environmentId
                  createdAt
                  suggestAddServiceDomain
                  status
                  environment {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`);

export async function servicesForProject(
  client: ApolloClient<NormalizedCacheObject>,
  projectId: string
) {
  const result = await client.query({
    query: servicesForProjectQuery,
    variables: { projectId },
  });

  return result.data.project.services.edges.map((edge) => edge.node);
}
