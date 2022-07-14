
CREATE TABLE blindedBlocksResponses (
    slot TEXT UNIQUE NOT NULL,
    relay_url TEXT NOT NULL,
    timestamp_sent TEXT NOT NULL,
    blinded_block TEXT NOT NULL,
    unblinded_block TEXT,
    response_time TEXT, -- in ms null if no response or timed out
    response_valid INTEGER, -- bool
    PRIMARY KEY(slot, relay_url)
);

CREATE INDEX relay_id ON blindedBlocksResponses (relay_url);
