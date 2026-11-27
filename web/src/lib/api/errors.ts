const HTTP_NOT_FOUND = 404

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(status: number, body: unknown) {
    super(`Request failed with status ${status}`)

    this.status = status
    this.body = body
  }
}

export function isNotFoundError(error: unknown) {
  return error instanceof ApiError && error.status === HTTP_NOT_FOUND
}
