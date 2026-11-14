from http import HTTPStatus


class PrepStackError(Exception):
    status_code = HTTPStatus.BAD_REQUEST

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class ResourceNotFoundError(PrepStackError):
    status_code = HTTPStatus.NOT_FOUND


class ResourceConflictError(PrepStackError):
    status_code = HTTPStatus.CONFLICT
