CREATE TABLE document_metadata (
    id TEXT PRIMARY KEY,
    title TEXT,
    url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    schema TEXT,
    goal_id UUID REFERENCES public.goals(id),
    project_id UUID REFERENCES public.projects(id),
    topic_id UUID REFERENCES public.topics(id)
);