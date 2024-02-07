import { ApolloClient, InMemoryCache } from "@apollo/client/index.js";
import { getAllProjects } from "./projects";
import { createNewService, deleteService, servicesForProject } from "./services";

const GRAPHQL_SERVER_URL = "https://backboard.railway.app/graphql/v2";
export function clientFactory(apiToken: string) {
  return new ApolloClient({
    uri: GRAPHQL_SERVER_URL,
    cache: new InMemoryCache({
      addTypename: false,
    }),
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });
}

export default function Api(apiToken: string) {
  const client = clientFactory(apiToken);

  return {
    getAllProjects: getAllProjects.bind(null, client),
    servicesForProject: servicesForProject.bind(null, client),
    deleteService: deleteService.bind(null, client),
    createService: createNewService.bind(null, client),
  };
}
