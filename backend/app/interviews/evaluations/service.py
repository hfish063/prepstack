from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import joinedload
from sqlmodel import Session, select

from app.interviews.evaluations.models import (
    CodingEvaluation,
    InterviewFeedback,
    InterviewPhaseEvaluation,
    InterviewSummary,
)
from app.interviews.evaluations.schemas import (
    InterviewPhaseEvaluationCreate,
    InterviewSummaryCreate,
)
from app.interviews.phases.models import InterviewPhase
from app.interviews.sessions.models import InterviewSession


def get_summary_by_interview(
    db: Session, interview: InterviewSession
) -> InterviewSummary | None:
    return db.exec(
        select(InterviewSummary).where(InterviewSummary.interview_id == interview.id)
    ).one_or_none()


def get_phase_evaluation(
    db: Session, phase: InterviewPhase
) -> InterviewPhaseEvaluation | None:
    return db.exec(
        select(InterviewPhaseEvaluation)
        .where(InterviewPhaseEvaluation.phase_id == phase.id)
        .options(
            joinedload(InterviewPhaseEvaluation.phase),
            joinedload(InterviewPhaseEvaluation.coding_evaluation).joinedload(
                CodingEvaluation.submission
            ),
        )
    ).one_or_none()


def get_phase_evaluations_by_interview(
    db: Session, interview: InterviewSession
) -> list[InterviewPhaseEvaluation]:
    return db.exec(
        select(InterviewPhaseEvaluation)
        .options(
            joinedload(InterviewPhaseEvaluation.phase),
            joinedload(InterviewPhaseEvaluation.coding_evaluation).joinedload(
                CodingEvaluation.submission
            ),
        )
        .join(InterviewPhase, InterviewPhase.id == InterviewPhaseEvaluation.phase_id)
        .where(InterviewPhase.interview_id == interview.id)
    ).all()


def save_phase_evaluation(
    db: Session,
    phase: InterviewPhase,
    evaluation_create: InterviewPhaseEvaluationCreate,
) -> InterviewPhaseEvaluation:
    evaluation = InterviewPhaseEvaluation(
        **evaluation_create.model_dump(exclude={"coding_evaluation"}), phase_id=phase.id
    )

    if evaluation_create.coding_evaluation:
        evaluation.coding_evaluation = CodingEvaluation(
            **evaluation_create.coding_evaluation.model_dump()
        )

    try:
        db.add(evaluation)
        db.commit()
        db.refresh(evaluation)
    except SQLAlchemyError:
        db.rollback()
        raise

    return evaluation


def save_summary(
    db: Session, interview: InterviewSession, summary_create: InterviewSummaryCreate
) -> InterviewSummary:
    summary = InterviewSummary(
        **summary_create.model_dump(exclude={"feedback"}),
        feedback=[
            InterviewFeedback(**item.model_dump()) for item in summary_create.feedback
        ],
        interview_id=interview.id
    )

    try:
        db.add(summary)
        db.commit()
        db.refresh(summary)
    except SQLAlchemyError:
        db.rollback()
        raise

    return summary
