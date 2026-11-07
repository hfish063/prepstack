from pydantic import BaseModel


class Judge0Status(BaseModel):
    id: int
    description: str


class Judge0Response(BaseModel):
    token: str
    status: Judge0Status
    stdout: str | None = None
    stderr: str | None = None
    compile_output: str | None = None
    time: str | None = None
    memory: int | None = None
