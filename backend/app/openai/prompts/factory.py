from app.enums import PhaseType
from app.openai.prompts.behavioral import BehavioralPrompt
from app.openai.prompts.conceptual import ConceptualPrompt
from app.openai.prompts.prompt import PhasePrompt


def get_phase_prompt(phase_type: PhaseType) -> PhasePrompt:
    if phase_type == PhaseType.BEHAVIORAL:
        return BehavioralPrompt()
    elif phase_type == PhaseType.CONCEPTUAL:
        return ConceptualPrompt()

    raise ValueError(f"No prompt implemented for phase type: {phase_type}")
