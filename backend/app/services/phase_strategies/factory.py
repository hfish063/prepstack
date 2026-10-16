from app.enums import PhaseType
from app.services.phase_strategies.behavioral import BehavioralStrategy
from app.services.phase_strategies.strategy import PhaseStrategy


def get_phase_strategy(phase_type: PhaseType) -> PhaseStrategy:
    if phase_type == PhaseType.BEHAVIORAL:
        return BehavioralStrategy()

    raise ValueError(f"No strategy implemented for phase type: {phase_type}")
