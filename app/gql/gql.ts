/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query AllProjects {\n    projects {\n      edges {\n        node {\n          id\n          name\n        }\n      }\n    }\n  }\n": types.AllProjectsDocument,
    "\n  mutation CreateService(\n    $projectId: String!\n    $name: String!\n    $source: String!\n    $variables: ServiceVariables!\n  ) {\n    serviceCreate(\n      input: {\n        projectId: $projectId\n        name: $name\n        source: { image: $source }\n        variables: $variables\n      }\n    ) {\n      id\n    }\n  }\n": types.CreateServiceDocument,
    "\n  mutation DeleteService($id: String!) {\n    serviceDelete(id: $id)\n  }\n": types.DeleteServiceDocument,
    "\n  query ServicesForProject($projectId: String!) {\n    project(id: $projectId) {\n      services {\n        edges {\n          node {\n            id\n            name\n            createdAt\n            deployments(last: 5) {\n              edges {\n                node {\n                  environmentId\n                  createdAt\n                  suggestAddServiceDomain\n                  status\n                  environment {\n                    name\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.ServicesForProjectDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AllProjects {\n    projects {\n      edges {\n        node {\n          id\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query AllProjects {\n    projects {\n      edges {\n        node {\n          id\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateService(\n    $projectId: String!\n    $name: String!\n    $source: String!\n    $variables: ServiceVariables!\n  ) {\n    serviceCreate(\n      input: {\n        projectId: $projectId\n        name: $name\n        source: { image: $source }\n        variables: $variables\n      }\n    ) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateService(\n    $projectId: String!\n    $name: String!\n    $source: String!\n    $variables: ServiceVariables!\n  ) {\n    serviceCreate(\n      input: {\n        projectId: $projectId\n        name: $name\n        source: { image: $source }\n        variables: $variables\n      }\n    ) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteService($id: String!) {\n    serviceDelete(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteService($id: String!) {\n    serviceDelete(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ServicesForProject($projectId: String!) {\n    project(id: $projectId) {\n      services {\n        edges {\n          node {\n            id\n            name\n            createdAt\n            deployments(last: 5) {\n              edges {\n                node {\n                  environmentId\n                  createdAt\n                  suggestAddServiceDomain\n                  status\n                  environment {\n                    name\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ServicesForProject($projectId: String!) {\n    project(id: $projectId) {\n      services {\n        edges {\n          node {\n            id\n            name\n            createdAt\n            deployments(last: 5) {\n              edges {\n                node {\n                  environmentId\n                  createdAt\n                  suggestAddServiceDomain\n                  status\n                  environment {\n                    name\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;