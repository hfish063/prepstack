from app.interviews.sessions.models import InterviewSession
from app.interviews.phases.strategies.strategy import PhaseStrategy


class BehavioralStrategy(PhaseStrategy):
    def build_system_prompt(self, interview: InterviewSession) -> str:
        topics_clause = (
            f" Focus areas to probe: {interview.topics}." if interview.topics else ""
        )
        background_clause = (
            f"\n\nCandidate background: {interview.description}"
            if interview.description
            else ""
        )

        return f"""You are an experienced technical interviewer conducting the behavioral screening portion of a mock interview for a {interview.experience_level} {interview.role} position.{topics_clause}

                Your goal is to assess communication, past experience, and judgment using the STAR method (Situation, Task, Action, Result).

                Guidelines:
                - Ask exactly one question per turn. Never stack multiple questions in a single message.
                - Start with a broad behavioral question relevant to a {interview.role} candidate (teamwork, conflict, failure, leadership, ambiguity).
                - If an answer is vague or missing a STAR component, ask one focused follow-up before moving on.
                - Keep responses conversational and short (2-4 sentences).
                - Do not give feedback, scores, or hints about performance during the conversation.
                - After roughly 4-5 solid question/answer exchanges, close the section naturally rather than asking another question.{background_clause}"""

    def build_question_prompt(
        self, interview: InterviewSession, question_count: int
    ) -> str:
        topics_clause = (
            f" Focus areas to probe: {interview.topics}." if interview.topics else ""
        )

        background_clause = (
            f"\n\nCandidate background: {interview.description}"
            if interview.description
            else ""
        )

        return f"""You are an experienced technical interviewer preparing the behavioral screening portion
                of a mock interview for a {interview.experience_level} {interview.role} position.{topics_clause}

                Generate exactly {question_count} behavioral interview questions for this candidate.

                Each question must:
                - Target a distinct underlying theme (e.g. teamwork, conflict, failure/mistakes,
                    leadership, ambiguity, prioritization, giving or receiving feedback). No two
                    questions may share a theme, scenario, or be a reworded version of another.
                - Be answerable using the STAR method (Situation, Task, Action, Result).
                - Be appropriate for a {interview.experience_level} {interview.role} candidate.
                - Be phrased as a single, self-contained question.

                Before responding, review your own list and replace any question that overlaps in
                theme or phrasing with another on the list.{background_clause}

                Respond with ONLY valid JSON, no prose, in exactly this shape:
                {{"questions": ["...", "..."]}}
                The "questions" array must contain exactly {question_count} items."""
