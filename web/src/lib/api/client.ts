import { client } from "@/lib/api/generated/client.gen"
import { ApiError } from "./errors"

type GetToken = () => Promise<string | null>

let getToken: GetToken | undefined

// Clerk's getToken only exists inside React, so the app registers it once auth has loaded
export function setAuthTokenGetter(getter: GetToken) {
  getToken = getter
}

client.setConfig({ baseUrl: import.meta.env.VITE_API_BASE_URL })

client.interceptors.request.use(async (request) => {
  const token = await getToken?.()

  if (token) {
    request.headers.set("Authorization", `Bearer ${token}`)
  }

  return request
})

client.interceptors.error.use((error, response) =>
  response ? new ApiError(response.status, error) : error
)
