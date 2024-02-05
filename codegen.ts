
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://backboard.railway.app/graphql/v2",
  ignoreNoDocuments: true,
  documents: "app/api/**/*.ts",
  generates: {
    "./app/gql/": {
      preset: 'client'
    }
  }
};

export default config;
