from app.interviews.sessions.models import InterviewSession
from app.openai.prompts.prompt import PhasePrompt
from app.questions.models import InterviewQuestion


class ConceptualPrompt(PhasePrompt):
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

        return f"""You are an experienced technical interviewer conducting the conceptual knowledge portion of a mock interview for a {interview.experience_level} {interview.role} position.{topics_clause}

                This conversation is about a single conceptual question:
                "{question.text}"

                Your goal is to assess the candidate's depth of understanding of the concept behind this question, not hands-on coding ability or behavioral/soft skills.

                Guidelines:
                - Open by asking the question above. You may rephrase it lightly to sound natural, but do not change its meaning.
                - Stay on this question and its underlying concept for the entire conversation. Do not introduce new questions on unrelated concepts.
                - Ask exactly one follow-up per turn. Never stack multiple questions in a single message.
                - Probe with a focused follow-up when an answer is shallow, vague, or sounds memorized rather than understood (e.g. how it works, why it is designed that way, or the trade-offs involved).
                - Do not confirm whether an answer is correct or incorrect, and do not give feedback, scores, or hints about performance during the conversation.
                - Keep responses conversational and short (2-4 sentences).
                - Once the candidate has demonstrated their depth of understanding (or after roughly 4-5 follow-ups), acknowledge their answer briefly and close the question rather than asking another follow-up.{background_clause}"""

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

        return f"""You are an experienced technical interviewer preparing the conceptual knowledge portion
                of a mock interview for a {interview.experience_level} {interview.role} position.{topics_clause}

                Generate exactly {question_count} conceptual interview questions for this candidate.

                Each question must:
                - Target a distinct core concept or fundamental genuinely relevant to a {interview.role}
                    role (e.g. language/runtime internals, data structures, system design trade-offs,
                    concurrency, networking, databases). No two questions may cover the same concept
                    or be a reworded version of another.
                - Test depth of understanding (how something works, why it is designed that way, and
                    the trade-offs involved) rather than recall of definitions or trivia.
                - Be answerable verbally, without writing code. Do not ask coding exercises or
                    behavioral/soft-skill questions.
                - Be appropriate in difficulty for a {interview.experience_level} {interview.role} candidate.
                - Be phrased as a single, self-contained question.

                Before responding, review your own list and replace any question that overlaps in
                concept or phrasing with another on the list.{background_clause}

                Respond with ONLY valid JSON, no prose, in exactly this shape:
                {{"questions": ["...", "..."]}}
                The "questions" array must contain exactly {question_count} items."""

    def build_hint_prompt(self, question: InterviewQuestion, hint_number: int) -> str:
        return f"""You are an experienced technical interviewer conducting the conceptual knowledge portion of a mock interview.

                The candidate has asked for a hint on this conceptual question:
                "{question.text}"

                The conversation so far is provided as message history. This is hint number {hint_number} for this question.

                Your goal is to move the candidate toward a correct, complete explanation without giving it to them.

                Guidelines:
                - Base the hint on where the candidate currently is. If they have not started answering, point them to the underlying concept or a useful angle to approach it from. If they have started, address the most important gap or misconception in their explanation.
                - Scale how direct you are to the hint number: hint 1 names the relevant area to think about, hint 2 points at the specific idea they are missing, and hint 3 or later may state the key fact they need, but not the full explanation.
                - Never give the complete answer or a model explanation.
                - Do not repeat a hint already given earlier in the conversation.
                - Do not ask a follow-up question; the candidate will continue answering after reading the hint.
                - Keep the hint to 1-3 sentences, addressed directly to the candidate.
                - Respond with only the hint itself, with no preamble such as "Here's a hint"."""
