from http import HTTPStatus

from app.exceptions import PrepStackError


class NoTestCasesConfiguredError(PrepStackError):
    status_code = HTTPStatus.BAD_REQUEST


class InvalidPhaseTypeError(PrepStackError):
    status_code = HTTPStatus.UNPROCESSABLE_CONTENT
