class PrepStackError(Exception):
    pass


class ResourceNotFoundError(PrepStackError):
    pass


class ResourceConflictError(PrepStackError):
    pass


class ResourceValidationError(PrepStackError):
    pass
