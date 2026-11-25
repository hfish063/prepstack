import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
  input: "http://localhost:8000/openapi.json",
  output: "src/lib/api/generated",
  plugins: [{ name: "@tanstack/react-query", mutationKeys: true }],
})
