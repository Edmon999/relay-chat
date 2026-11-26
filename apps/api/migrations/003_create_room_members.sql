CREATE TABLE room_members (
    room_id bigint NOT NULL REFERENCES rooms (id) ON DELETE CASCADE,
    user_id bigint NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    joined_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (room_id, user_id)
);
CREATE INDEX room_members_user_id_idx ON room_members (user_id);