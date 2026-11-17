from app.interviews.sessions.models import InterviewSession
from app.openai.prompts.prompt import PhasePrompt
from app.questions.models import InterviewQuestion


class BehavioralPrompt(PhasePrompt):
    def build_system_prompt(
        self, interview: InterviewSession, question: InterviewQuestion
    ) -> str:
        topics_clause = (
            f" Focus areas to probe: {interview.topics}." if interview.topics else ""
        )
        background_clause = (
            f"\n\nCandidate background: {interview.description}"
            if interview.description
            else ""
        )

        return f"""You are an experienced technical interviewer conducting the behavioral screening portion of a mock interview for a {interview.experience_level} {interview.role} position.{topics_clause}

                This conversation is about a single behavioral question:
                "{question.text}"

                Your goal is to assess communication, past experience, and judgment through the candidate's answer to this question, using the STAR method (Situation, Task, Action, Result).

                Guidelines:
                - Open by asking the question above. You may rephrase it lightly to sound natural, but do not change its meaning.
                - Stay on this question for the entire conversation. Do not introduce new behavioral questions or switch to unrelated topics.
                - Ask exactly one follow-up per turn. Never stack multiple questions in a single message.
                - If the answer is vague or missing a STAR component, ask a focused follow-up that draws out the missing detail.
                - Keep responses conversational and short (2-4 sentences).
                - Do not give feedback, scores, or hints about performance during the conversation.
                - Once the candidate has given a complete STAR answer (or after roughly 4-5 follow-ups), acknowledge their answer briefly and close the question rather than asking another follow-up.{background_clause}"""

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
