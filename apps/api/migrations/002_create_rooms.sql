CREATE TABLE rooms (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 64),
    created_by bigint NOT NULL REFERENCES users (id),
    created_at timestamptz NOT NULL DEFAULT now()
);