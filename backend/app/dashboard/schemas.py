from app.schemas import CamelModel


class DashboardSummaryRead(CamelModel):
    interviews_created: int
    interviews_completed: int
    messages_sent: int
    hints_used: int
    submissions_accepted: int
