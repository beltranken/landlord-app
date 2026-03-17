import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: {
    path: "../backend/openapi.json",
    watch: true,
  },
  output: {
    importFileExtension: null,
    path: "./api",
    postProcess: ["eslint", "prettier"],
  },
  plugins: [
    "@hey-api/client-axios",
    "@hey-api/schemas",
    {
      dates: true,
      name: "@hey-api/transformers",
    },
    {
      enums: "javascript",
      name: "@hey-api/typescript",
    },
    {
      name: "@hey-api/sdk",
      transformer: true,
    },
  ],
});
