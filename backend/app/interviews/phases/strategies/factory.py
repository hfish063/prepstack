from app.enums import PhaseType
from app.interviews.phases.strategies.behavioral import BehavioralStrategy
from app.interviews.phases.strategies.conceptual import ConceptualStrategy
from app.interviews.phases.strategies.strategy import PhaseStrategy


def get_phase_strategy(phase_type: PhaseType) -> PhaseStrategy:
    if phase_type == PhaseType.BEHAVIORAL:
        return BehavioralStrategy()
    elif phase_type == PhaseType.CONCEPTUAL:
        return ConceptualStrategy()

    raise ValueError(f"No strategy implemented for phase type: {phase_type}")
