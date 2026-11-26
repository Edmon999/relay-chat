CREATE TABLE messages (
    id uuid PRIMARY KEY DEFAULT uuidv7(),
    room_id bigint NOT NULL REFERENCES rooms (id) ON DELETE CASCADE,
    author_id bigint NOT NULL REFERENCES users (id),
    body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000),
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX messages_room_id_id_idx ON messages (room_id, id);