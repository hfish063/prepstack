from enum import StrEnum
import logging

from app.config import get_settings


class LogLevels(StrEnum):
    info = "INFO"
    warn = "WARN"
    error = "ERROR"


def configure_logging():
    log_level = get_settings().LOG_LEVEL.upper()
    log_levels = list(LogLevels)

    if log_level not in log_levels:
        # Use error as the default log level
        logging.basicConfig(level=LogLevels.error.value)
        return

    logging.basicConfig(level=log_level)