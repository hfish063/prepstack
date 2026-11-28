from sqlmodel import Session

from app.exceptions import ResourceConflictError, ResourceNotFoundError
from app.openai import service as openai_service
from app.questions.saved import service as saved_question_service
from app.questions.saved.models import SavedQuestion, SavedQuestionAnalysis
from app.questions.saved.schemas import SavedQuestionAnalysisCreate


def analyze_question(
    db: Session, saved_question: SavedQuestion
) -> SavedQuestionAnalysis:
    """Generates and persists an analysis for a saved question.

    Each saved question can only be analyzed once.
    """
    if saved_question_service.get_analysis(db, saved_question):
        raise ResourceConflictError("This question has already been analyzed.")

    response = openai_service.generate_question_analysis(saved_question)

    return saved_question_service.save_analysis(
        db, saved_question, SavedQuestionAnalysisCreate(**response.model_dump())
    )
